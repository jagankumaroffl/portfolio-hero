// Education data, kept intentionally minimal and separate from
// presentation. Only facts explicitly confirmed are included — no
// institution name, CGPA/percentage, graduation year, school name,
// rankings or awards are invented. If those become available later, add
// them as fields here rather than hardcoding them into a component.

export interface EducationEntry {
  level: string;
  program: string;
  foundation: string[];
}

export const EDUCATION: EducationEntry[] = [
  // {
  //   level: "HSC",
  //   program: "Computer Science",
  //   foundation: ["Python", "Number Systems", "Computer Fundamentals"],
  // },
  {
    level: "B.E",
    program: "Electronics & Communication Engineering (ECE)",
    foundation: [
      "Electronic Components",
      "Digital Electronics",
      "VLSI",
      "Java",
      "C",
      "Data Structures",
      "SQL",
      "Embedded Systems",
      "Computer Networks",
      "AI/ML Fundamentals",
    ],
  },
];