  var demog_question_age = {
        type: 'demog-age',
        questions: [
        {prompt: "How old are you?", name: "age", required: true}
        ],
    }
    
     var demog_question_ethnicity = {
        type: "demog-ethnic-US", 
        button_label: "Done", 
        questions: [
            {prompt: "What is your racial or ethnic identification? Check all that apply.", name: "ethnicity", options:  ["American Indian or Alaska Native", "Asian", "Black or African American", "Hispanic or Latino", "Native Hawaiian or Other Pacific Islander", "White", "Other"], required: true}
        ]
    }
     
    var demog_gender_and_education = {
        type: "demog-gender-and-education", 
        button_label: "Done", 
        questions: [
            {prompt: "What is your gender?", name: "gender", options: ["Female", "Male", "Non-binary", "Decline to Answer"], required: true}, 
            {prompt: "What is the highest degree or the higest level of school you have completed? If you are currently enrolled as a student, then please select the highest degree or education you have received.", name: "education", options: ["Some high school", "High school diploma", "Associate Degree/Technical certification", "Bachelor's Degree",  "Master's Degree", "Doctorate/Professional degree", "Other"], required: true}
        ]
    }
  
    var demog_disorder_history = {
        type: "demog-disorder-history", 
        button_label: "Done", 
        questions: [
            {prompt: "Do you currently have any neurological disorders?", name: "current_neuro", options: ["Yes", "No"], required: true}, 
            {prompt: "Have you had any neurological disorders in the past?", name: "past_neuro", options: ["Yes", "No"], required: true},
            {prompt: "Do you currently have any learning disabilities?", name: "current_ld", options: ["Yes", "No"], required: true},
            {prompt: "Have you had any history of learning disabilities in the past?", name: "past_ld", options: ["Yes", "No"], required: true}
        ]
    }
    
    
var demog_questions = [demog_question_age, 
                       demog_question_ethnicity, 
                       demog_gender_and_education, 
                       demog_disorder_history]