import PDFDocument from "pdfkit";

export const generateReportPDF = (data, res) => {
  const doc = new PDFDocument();

  // stream PDF to response
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=attendance-report.pdf"
  );

  doc.pipe(res);

  // HEADER
  doc.fontSize(18).text("Attendance Report", { align: "center" });
  doc.moveDown();

  // SUMMARY
  doc.fontSize(12).text(`Total Sessions: ${data.sessions.length}`);
  doc.text(`Total Records: ${data.records.length}`);
  doc.moveDown();

  // SESSIONS
  doc.fontSize(14).text("Sessions:");
  doc.moveDown(0.5);

  data.sessions.forEach((s, i) => {
    doc
      .fontSize(10)
      .text(
        `${i + 1}. Class: ${s.classId?.degree || ""} | Subject: ${
          s.subject?.name || ""
        } | Teacher: ${s.teacher?.name || "N/A"} | Status: ${s.status}`
      );
  });

  doc.moveDown();

  // ATTENDANCE RECORDS
  doc.fontSize(14).text("Attendance Records:");
  doc.moveDown(0.5);

  data.records.forEach((r, i) => {
    doc
      .fontSize(10)
      .text(
        `${i + 1}. Student: ${r.student?.name || ""} | Roll: ${
          r.student?.rollNumber || ""
        } | Status: ${r.status} | Confidence: ${r.confidence || 0}`
      );
  });

  doc.end();
};