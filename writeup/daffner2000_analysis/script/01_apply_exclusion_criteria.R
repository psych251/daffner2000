library(tidyverse)
library(here)
library(jsonlite)
library(kableExtra)
library(DT)
library(lme4)

##### Exclude participants ##### 

# 1. Exclude participants based on demographic answers. 
# Exclude if they had or currently have neurological disorders or learning disabilities 
filter_demog <- function(data_with_demog){
  filtered_data <- data_with_demog %>% 
    filter(
      current_neuro != "Yes" && past_neuro != "Yes" && current_ld != "Yes" && past_ld != "Yes"
    )
  return (filtered_data)
} 

# 2. Exclude participants based on their responses on space bar reactions.  
# Exclude if they pressed space bar on non-target trials > 25%, or pressed space bar on target < 75%
filter_spacebar <- function(data_with_demog){
  
  prop_press_space_summary <- data_with_demog %>% 
    select(subject, trial_pressed_space_bar, trial_stimulus_type) %>% 
    mutate(trial_pressed_space_bar = if_else(is.na(trial_pressed_space_bar), "no", trial_pressed_space_bar)) %>% 
    filter(trial_stimulus_type == "target") %>% 
    group_by(subject,trial_pressed_space_bar) %>% 
    summarize(
      n = n()
    ) %>% 
    pivot_wider(names_from = trial_pressed_space_bar, values_from = n) %>% 
    mutate(
      no = if_else(is.na(no), 0.0, as.numeric(no)),
      yes = if_else(is.na(yes), 0.0, as.numeric(yes)), 
      sum = no + yes, 
      no_press_prop = no / sum
    ) %>% 
    select(subject, no_press_prop)
  
  ## proportion of pressing space bar in non-target trial 
  prop_wrong_press_summary <- data_with_demog %>% 
    select(subject, trial_pressed_space_bar, trial_stimulus_type) %>% 
    mutate(trial_pressed_space_bar = if_else(is.na(trial_pressed_space_bar), "no", trial_pressed_space_bar)) %>% 
    filter(trial_stimulus_type != "target") %>% 
    group_by(subject,trial_pressed_space_bar) %>% 
    summarize(
      n = n()
    ) %>% 
    pivot_wider(names_from = trial_pressed_space_bar, values_from = n) %>% 
    mutate(
      no = if_else(is.na(no), 0.0, as.numeric(no)),
      yes = if_else(is.na(yes), 0.0, as.numeric(yes)), 
      sum = no + yes, 
      wrong_press_prop = yes / sum
    ) %>% 
    select(subject, wrong_press_prop)
  
  data_with_demog_spacebar <- left_join(data_with_demog, prop_press_space_summary, by = "subject")
  data_with_demog_spacebar <- left_join(data_with_demog_spacebar, prop_wrong_press_summary, by = "subject")
  
  filtered_spacebar <- data_with_demog_spacebar %>% 
    filter(no_press_prop > 0.15 | wrong_press_prop > 0.15)
  
  return(filtered_spacebar)
}



# 3. Exclude participants based on their variations of responses 
# Exclude if their looking time on all trials has sd is < 300

filter_trial_variation <- function(data_with_demog){
  to_exclude_subj <- data_with_demog %>% 
    group_by(subject) %>% 
    filter(trial_type == "stimulus-presentation") %>% 
    summarize(
      lookingtime_sd = sd(trial_looking_time)
    ) %>% 
    filter(lookingtime_sd < 300) %>% 
    select(subject) %>% 
    pull()
  
  filtered_no_variation_df <- data_with_demog %>% 
    filter(!(subject %in% to_exclude_subj))
  
  return(filtered_no_variation_df)
}


# 4. Exclude participants based on number of outliers in their responses 
# outlier is defined as 3SD away of mean after log transformation

filter_too_many_outliers <- function(data_with_demog){
  
  
  summary_lt <- data_with_demog %>% 
    filter(trial_type == "stimulus-presentation") %>% 
    summarize(
      mean_lt = mean(log(as.numeric(trial_looking_time)), na.rm = TRUE), 
      sd_lt = sd(log(trial_looking_time), na.rm = TRUE),
      upper_lt = mean_lt + 3 * sd_lt, 
      lower_lt = mean_lt - 3 * sd_lt
    )
  
  UPPER_LT <- summary_lt %>% select(upper_lt) %>% pull()
  LOWER_LT <- summary_lt %>% select(lower_lt) %>% pull()
  
  
  
  
  trial_lt_to_cut <- data_with_demog %>% 
    filter(trial_type == "stimulus-presentation") %>% 
    filter(log(trial_looking_time) < LOWER_LT | log(trial_looking_time) > UPPER_LT)
  
  
  num_total_trials <- data_with_demog %>% 
    filter(trial_type == "stimulus-presentation") %>% 
    group_by(subject) %>% 
    count() %>% 
    mutate(
      total_trial_num = n
    ) %>% 
    select(-n)
  
  num_to_cut_trials <- trial_lt_to_cut %>% 
    filter(trial_type == "stimulus-presentation") %>% 
    group_by(subject) %>% 
    count() %>% 
    mutate(
      excluded_trial_num = n
    ) %>% 
    select(-n)
  
  summary_trial_cut_table <- left_join(num_total_trials, num_to_cut_trials, by = "subject") %>% 
    mutate(
      exclude_proportion = excluded_trial_num / total_trial_num
    )
  
  excluded_participants_id <- summary_trial_cut_table %>% 
    filter(exclude_proportion > 0.25) %>% 
    select(subject) %>% 
    pull()
  
  filtered_too_many_outliers <- data_with_demog %>% 
    filter(!(subject %in% excluded_participants_id))
  
  return(filtered_too_many_outliers)
  
} 

##### Exclude trials ##### 

# trial-level exclusion
# exclude trail if 3SD away from log-transformed means

filter_outlier_trial <- function(data_with_demog){
  
  
  
  
  summary_lt <- data_with_demog %>% 
    filter(trial_type == "stimulus-presentation") %>% 
    summarize(
      mean_lt = mean(log(as.numeric(trial_looking_time)), na.rm = TRUE), 
      sd_lt = sd(log(trial_looking_time), na.rm = TRUE),
      upper_lt = mean_lt + 3 * sd_lt, 
      lower_lt = mean_lt - 3 * sd_lt
    )
  
  
  UPPER_LT <- summary_lt %>% select(upper_lt) %>% pull()
  LOWER_LT <- summary_lt %>% select(lower_lt) %>% pull()
  
  trial_filtered_df <- data_with_demog %>% 
    filter(trial_type == "stimulus-presentation") %>% 
    filter(!(log(trial_looking_time) < LOWER_LT | log(trial_looking_time) > UPPER_LT))
  
  return(trial_filtered_df)
  
  
}

