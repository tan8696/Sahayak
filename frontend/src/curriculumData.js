const generateEmptyClass = () => ({
    subjects: {
        Math: { studyMaterial: [], classwork: [], assignments: [] },
        Science: { studyMaterial: [], classwork: [], assignments: [] },
        English: { studyMaterial: [], classwork: [], assignments: [] }
    }
});

export const curriculumData = {
    "Class 1": generateEmptyClass(),
    "Class 2": generateEmptyClass(),
    "Class 3": {
        subjects: {
            Math: {
                studyMaterial: [
                    "Chapter 1: Addition summary - Learn to add numbers up to 100.",
                    "Chapter 2: Subtraction basics - Taking away numbers.",
                    "Chapter 3: Multiplication tables - Memorize tables 2 to 5."
                ],
                classwork: [
                    { id: "c3_m_cw1", question: "What is 25 + 14?" },
                    { id: "c3_m_cw2", question: "What is 8 x 4?" }
                ],
                assignments: [
                    { id: "c3_m_as1", title: "Practice worksheet: Addition and Subtraction" },
                    { id: "c3_m_as2", title: "Memorize multiplication table of 4" }
                ]
            },
            Science: {
                studyMaterial: [
                    "Chapter 1: Living and Non-living things.",
                    "Chapter 2: Parts of a Plant."
                ],
                classwork: [
                    { id: "c3_s_cw1", question: "Is a rock living or non-living?" },
                    { id: "c3_s_cw2", question: "Name the part of the plant that grows under the soil." }
                ],
                assignments: [
                    { id: "c3_s_as1", title: "Collect 3 different types of leaves." }
                ]
            }
        }
    },
    "Class 4": generateEmptyClass(),
    "Class 5": generateEmptyClass(),
    "Class 6": generateEmptyClass(),
    "Class 7": generateEmptyClass(),
    "Class 8": generateEmptyClass(),
    "Class 9": generateEmptyClass(),
    "Class 10": {
        subjects: {
            Math: {
                studyMaterial: [
                    "Chapter 1: Real Numbers - Euclid's division lemma.",
                    "Chapter 2: Polynomials - Zeroes of a polynomial.",
                    "Chapter 3: Quadratic Equations."
                ],
                classwork: [
                    { id: "c10_m_cw1", question: "Find the roots of x^2 - 5x + 6 = 0." },
                    { id: "c10_m_cw2", question: "State Euclid's division lemma." }
                ],
                assignments: [
                    { id: "c10_m_as1", title: "Exercise 1.1 to 1.3 completed in notebook." },
                    { id: "c10_m_as2", title: "Project: Applications of Trigonometry in real life." }
                ]
            },
            Science: {
                studyMaterial: [
                    "Chapter 1: Chemical Reactions and Equations.",
                    "Chapter 2: Acids, Bases and Salts.",
                    "Chapter 3: Light - Reflection and Refraction."
                ],
                classwork: [
                    { id: "c10_s_cw1", question: "Balance the chemical equation: Fe + H2O -> Fe3O4 + H2" },
                    { id: "c10_s_cw2", question: "What is the pH of a neutral solution?" }
                ],
                assignments: [
                    { id: "c10_s_as1", title: "Lab Record: Experiment on reflection of light." }
                ]
            },
            English: {
                studyMaterial: [
                    "Chapter 1: A Letter to God.",
                    "Chapter 2: Nelson Mandela: Long Walk to Freedom."
                ],
                classwork: [
                    { id: "c10_e_cw1", question: "Who was Lencho?" }
                ],
                assignments: [
                    { id: "c10_e_as1", title: "Essay: The importance of freedom." }
                ]
            }
        }
    },
    "Class 11": generateEmptyClass(),
    "Class 12": generateEmptyClass(),
};
