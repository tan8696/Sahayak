const subjects = ["Math", "Science", "Hindi", "English"];
const types = ["Study Material", "Classwork", "Assignment"];

function generateLibrary() {
    const library = [];
    for (let c = 1; c <= 12; c++) {
        subjects.forEach(subject => {
            for (let ch = 1; ch <= 5; ch++) {
                // Generate 1 Study Material, 1 Classwork, 1 Assignment for each chapter to be robust
                types.forEach(type => {
                    library.push({
                        id: `c${c}_${subject.toLowerCase()}_ch${ch}_${type.replace(/\s+/g, '').toLowerCase()}`,
                        class: c,
                        subject: subject,
                        chapterNumber: ch,
                        chapterTitle: `Chapter ${ch}: Fundamentals of ${subject} (Part ${ch})`,
                        type: type,
                        content: type === "Study Material" 
                            ? `This is the study material for Class ${c} ${subject}, Chapter ${ch}. Learn the core concepts here.`
                            : type === "Classwork"
                                ? `Question 1: What did you learn in Class ${c} ${subject} Chapter ${ch}?`
                                : `Homework: Write a short summary of Class ${c} ${subject} Chapter ${ch}.`
                    });
                });
            }
        });
    }
    return library;
}

export const fullLibraryDB = generateLibrary();
