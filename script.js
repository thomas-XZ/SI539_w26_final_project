document.addEventListener('DOMContentLoaded', () => {
    //Define the containers to deal with inputs

    const eduContainer = document.getElementById('education-container');
    const expContainer = document.getElementById('experience-container');
    const skillsContainer = document.getElementById('skills-container');

    const addEduBtn = document.getElementById('add-edu-btn');
    const addExpBtn = document.getElementById('add-exp-btn');
    const addSkillBtn = document.getElementById('add-skill-btn');
    const generateBtn = document.getElementById('generate-btn');
    const downloadBtn = document.getElementById('download-btn');

    const resumeForm = document.getElementById('resume-form');
    const resumeOutput = document.getElementById('resume-output');

    const eduTemplate = document.getElementById('edu-template');
    const expTemplate = document.getElementById('exp-template');
    const skillTemplate = document.getElementById('skill-template');

    // Entry addition/removal logic
    function addEntry(template, container) {
        const clone = template.content.cloneNode(true);

        const removeBtn = clone.querySelector('.remove-btn');
        removeBtn.addEventListener('click', (e) => {
            e.target.closest('.dynamic-entry').remove();
        });

        container.appendChild(clone);

        const newlyAddedInputs = container.lastElementChild.querySelectorAll('input, textarea');
        if (newlyAddedInputs.length > 0) {
            newlyAddedInputs[0].focus();
        }
    }

    addEduBtn.addEventListener('click', () => addEntry(eduTemplate, eduContainer));
    addExpBtn.addEventListener('click', () => addEntry(expTemplate, expContainer));
    addSkillBtn.addEventListener('click', () => addEntry(skillTemplate, skillsContainer));

    // Initialize with one empty entry each
    addEntry(eduTemplate, eduContainer);
    addEntry(expTemplate, expContainer);
    addEntry(skillTemplate, skillsContainer);


    // Generate preview logic
    resumeForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get input data
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const links = document.getElementById('links').value;

        const eduEntries = Array.from(eduContainer.querySelectorAll('.dynamic-entry')).map(entry => {
            return {
                school: entry.querySelector('.edu-school').value.trim(),
                degree: entry.querySelector('.edu-degree').value.trim(),
                year: entry.querySelector('.edu-year').value.trim()
            };
        }).filter(entry => entry.school !== '' || entry.degree !== '');

        const expEntries = Array.from(expContainer.querySelectorAll('.dynamic-entry')).map(entry => {
            return {
                company: entry.querySelector('.exp-company').value.trim(),
                title: entry.querySelector('.exp-title').value.trim(),
                duration: entry.querySelector('.exp-duration').value.trim(),
                desc: entry.querySelector('.exp-desc').value.trim()
            };
        }).filter(entry => entry.company !== '' || entry.title !== '');

        const skills = Array.from(skillsContainer.querySelectorAll('.skill-input'))
            .map(input => input.value.trim())
            .filter(val => val !== '');

        // Construct HTML for resume display
        let htmlContent = `
            <div style="font-family: system-ui, -apple-system, sans-serif; color: #1A1A1A; line-height: 1.6;">
                <div style="text-align: center; margin-bottom: 2rem;">
                    <h1 style="color: #00274C; margin-bottom: 0.5rem; font-size: 2.5rem;">${fullName}</h1>
                    <p style="color: #333; font-size: 1.1rem; margin: 0;">
                        ${email} ${phone ? `| ${phone}` : ''} ${links ? `| ${links}` : ''}
                    </p>
                </div>
        `;

        if (eduEntries.length > 0) {
            htmlContent += `
                <div style="margin-bottom: 1.5rem;">
                    <h2 style="color: #00274C; border-bottom: 2px solid #FFCB05; padding-bottom: 5px; margin-bottom: 15px;">Education</h2>
            `;
            eduEntries.forEach(edu => {
                htmlContent += `
                    <div style="margin-bottom: 10px;">
                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                            <h3 style="margin: 0; font-size: 1.2rem;">${edu.school}</h3>
                            <span style="font-weight: bold; color: #00274C;">${edu.year}</span>
                        </div>
                        <p style="margin: 5px 0 0 0; font-style: italic;">${edu.degree}</p>
                    </div>
                `;
            });
            htmlContent += `</div>`;
        }

        if (expEntries.length > 0) {
            htmlContent += `
                <div style="margin-bottom: 1.5rem;">
                    <h2 style="color: #00274C; border-bottom: 2px solid #FFCB05; padding-bottom: 5px; margin-bottom: 15px;">Work Experience</h2>
            `;
            expEntries.forEach(exp => {
                htmlContent += `
                    <div style="margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                            <h3 style="margin: 0; font-size: 1.2rem;">${exp.title}</h3>
                            <span style="font-weight: bold; color: #00274C;">${exp.duration}</span>
                        </div>
                        <p style="margin: 5px 0; font-weight: bold;">${exp.company}</p>
                        <p style="margin: 0; white-space: pre-wrap;">${exp.desc}</p>
                    </div>
                `;
            });
            htmlContent += `</div>`;
        }

        if (skills.length > 0) {
            htmlContent += `
                <div style="margin-bottom: 1.5rem;">
                    <h2 style="color: #00274C; border-bottom: 2px solid #FFCB05; padding-bottom: 5px; margin-bottom: 15px;">Skills</h2>
                    <p style="margin: 0; font-size: 1.1rem;">${skills.join(' &bull; ')}</p>
                </div>
            `;
        }

        htmlContent += `</div>`;

        // Assign generated resume to container
        resumeOutput.innerHTML = htmlContent;

        // Enable download only after generation
        downloadBtn.disabled = false;
        downloadBtn.removeAttribute('aria-disabled');
    });

    //    Resume export
    downloadBtn.addEventListener('click', () => {
        // get preview html
        const content = resumeOutput.innerHTML;
        const userName = document.getElementById('fullName').value.trim() || 'Resume';

        // Open new tab
        const printWindow = window.open('', '_blank');

        // export preview html
        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <title>${userName} - Resume Print</title>
                <style>
                    body {
                        color: black;
                        background-color: white;
                        margin: 0;
                        padding: 20px;
                    }
                </style>
            </head>
            <body>
                ${content}
            </body>
            </html>
        `);

        // HTML stop
        printWindow.document.close();
        printWindow.focus();

        // print
        printWindow.print();

    });
});