import jsPDF from "jspdf"
import psci_image from '../assets/PSciAI-Black.png'

export const exportPDF = (data, user) => {

    const doc = new jsPDF();

    console.log(data);
    // text max width
    const maxWidth = 180;

    const pageHeight = doc.internal.pageSize.height;

    // left start position
    const left = 12;

    // image width 40, height 20
    doc.addImage(psci_image, "PNG", 13, 10, 40, 20);

    doc.setFont("helvetica");
    doc.setFontSize(9);

    doc.setFont(undefined, 'bold');
    doc.text('Asset Name:', left, 40);
    doc.setFont(undefined, 'normal');
    doc.text(data.asset.name, 33, 40);

    doc.setFont(undefined, 'bold');
    doc.text('Asset Generator:', left, 48);
    doc.setFont(undefined, 'normal');
    doc.text(data.asset.generator_name, 40, 48);


    doc.setFont(undefined, 'bold');
    doc.text('Created by:', left, 56);
    doc.setFont(undefined, 'normal');
    doc.text(`${user.profile.fname} ${user.profile.lname}`, 32, 56);

    doc.setFont(undefined, 'bold');
    doc.text('Date Created:', left, 64);
    doc.setFont(undefined, 'normal');
    doc.text(data.asset.created_at, 34, 64);

    let y = 80;
    data.asset.interactions.forEach((interaction, index) => {
        const promptLines = doc.splitTextToSize(interaction.prompt, maxWidth);
        const responseLines = doc.splitTextToSize(interaction.response, maxWidth);
        const lineHeight = 5; // Adjust this value based on your font size and style

        doc.text('PROMPT:', left, y);
        if (checkHeight(y, pageHeight).newPage) {
            doc.addPage()
            y = 20
        }
        promptLines.forEach((line) => {
            doc.text(line, left, y + 5);
            y += lineHeight;
            if (checkHeight(y, pageHeight).newPage) {
                doc.addPage()
                y = 20
            }
        });

        doc.text('RESPONSE:', left, y + 6);
        if (checkHeight(y, pageHeight).newPage) {
            doc.addPage()
            y = 20
        }
        responseLines.forEach((line) => {
            doc.text(line, left, y + 11);
            y += lineHeight;
            if (checkHeight(y, pageHeight).newPage) {
                doc.addPage()
                y = 20
            }
        });

        y += 20; // Adjust this value to add spacing between interactions
    })

    // Get the current date and time
    const currentDate = new Date();

    // Format the date and time as desired (e.g., YYYY-MM-DD_HH-MM-SS)
    const formattedDateTime = currentDate.toISOString().replace(/[-:.]/g, "_").replace("T", "_").split(".")[0];


    // Save the PDF
    doc.save(`asset-${data.asset.name}-${formattedDateTime}.pdf`)
}

const checkHeight = (y, pageHeight) => {
    if (y > pageHeight - 20) {
        return { y: 20, newPage: true }
    }
    return { y: y, newPage: false };
}