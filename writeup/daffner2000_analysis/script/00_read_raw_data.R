library(here)
library(tidyverse)




aggregate_data <- function(input_path, output_path){

raw_df <- list.files(input_path, full.names = T) %>%
  map_df(read_csv) %>% 
  select(rt, trial_type, trial_index, subject, trial_stimulus, trial_stimulus_type, 
         task_type, task_target_stimulus, task_background_stimulus, task_deviant_stimuli, task_order_number, block_order_number, trial_looking_time, 
         trial_pressed_space_bar,trial_space_bar_rt, responses, question_order) %>% 
  filter(trial_type == "stimulus-presentation" | trial_type == "demog-age" | trial_type == "demog-gender-and-education" | trial_type == "demog-ethnic-US" | trial_type == "demog-disorder-history") %>% 
  mutate(
    stimuli_type = case_when(
      grepl("complex", trial_stimulus) ~ "complex", 
      grepl("simple", trial_stimulus) ~ "simple"
  ))

demog_df <- raw_df %>% 
  filter(grepl("demog", trial_type)) %>% 
  select(subject, trial_type, responses) %>% 
  toJSON() %>% 
  fromJSON() %>% 
  mutate(
    demog_question = map(responses, ~ fromJSON(.) %>% as.data.frame())) %>% 
  unnest(demog_question)  %>% 
  group_by(subject) %>%
  mutate_at(vars(-group_cols()), function(x) {x[!is.na(x)][1]}) %>%
  distinct() %>% 
  select(-trial_type, responses)


data_with_demog <- left_join(raw_df,demog_df, by = "subject") %>% 
  filter(trial_type == "stimulus-presentation")

write_csv(data_with_demog, output_path)

}