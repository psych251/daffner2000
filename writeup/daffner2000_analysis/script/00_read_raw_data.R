library(here)
library(tidyverse)

#FIXME: CURRENT VERSION ADAPT TO THE EXISTING (NOW FIXED TYPOS)

RAW_DATA_DIR <- here("raw_data/")
PROCESSED_DATA_PATH <- here("processed_data/processed_data.csv")


raw_df <- list.files(RAW_DATA_DIR, full.names = T) %>%
  map_df(read_csv) %>% 
  mutate(
    block_order_number = blcok_order_number
  ) %>% 
  select(rt, trial_type, trial_index, subject, trial_stimulus, trial_stimulus_type, 
         task_type, task_target_stimulus, task_background_stimulus, task_deviant_stimuli, task_order_number, block_order_number, trial_looking_time, 
         trial_pressed_space_bar, responses, question_order) %>% 
  filter(trial_type == "stimulus-presentation" | trial_type == "demog-age" | trial_type == "demog-gender-and-education" | trial_type == "demog-ethnic-US" | trial_type == "demog-disorder-history") %>% 
  mutate(
    stimuli_type = case_when(
    grepl("complex", trial_stimulus) ~ "complex", 
    grepl("simple", trial_stimulus) ~ "simple"
  ))

write_csv(raw_df, PROCESSED_DATA_PATH)