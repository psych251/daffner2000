library(here)
library(tidyverse)

RAW_DATA_DIR <- here("raw_data/")


raw_df <- list.files(RAW_DATA_DIR, full.names = T) %>%
  map_df(read_csv) %>% 
  select(rt, trial_type, trial_index, subject, stimulus, trial_stimulus, trial_stimulus_type, 
         task_type, task_target_stimulus, task_background_stimulus, task_deviant_stimuli, task_order_number, block_order_number, trial_looking_time, 
         trial_pressed_space_bar, responses, question_order) %>% 
  filter(trial_type == "stimulus-presentation" | trial_type == "demog-age" | trial_type == "demog-gender-and-education" | trial_type == "demog-ethnic-US" | trial_type == "demog-disorder-history")