import { ofetch } from "ofetch";

export type StudentHistory = {
	grade: string;
	ra: number;
	curso: string;
}

export type SigHistory = {
  ra: string;
  grade: string;
  course: string;
  components: {
    grade: "A" | "B" | "C" | "D" | "O" | "F" | "E" | null;
    name: string;
    status: string | null;
    year: string;
    period: "1" | "2" | "3";
    UFCode: string;
    category: "mandatory" | "free" | "limited";
    credits: number;
  }[];
};

export type Grade = "A" | "B" | "C" | "D" | "O" | "F";

export type Distribution = {
  conceito: Grade;
  weight: number;
  count: number;
  cr_medio: number;
  numeric: number;
  numericWeight: number;
  amount: number;
  cr_professor: number;
}

type SubjectDetailedReview = {
  _id: {
    mainTeacher: string;
  }
  distribution: Array<Distribution>
  numericWeight: number;
  numeric: number;
  amount: number;
  count: number;
  cr_professor: number;
  cr_medio: number;
  teacher: {
    _id: string;
    name: string;
    alias: string[] | null
  }
}

type TeacherDetailedReview = {
  _id: {
    _id: string;
    name: string;
    search: string;
    updatedAt: string;
    createdAt: string
    __v: number;
    creditos: number;
  }
  distribution: Array<Distribution>
  numericWeight: number;
  numeric: number;
  amount: number;
  count: number;
  cr_professor: number;
  cr_medio: number;
}

export type SubjectReview = {
  subject: {
    _id: string,
    name: string,
    search: string,
    updatedAt: string,
    creditos: number
  }
  general:  {
    distribution: Array<Distribution>
    cr_medio: number;
    cr_professor: number;
    count: number;
    amount: number;
    numeric: number;
    numericWeight: number;
    weight: number;
  }
  specific: Array<SubjectDetailedReview>
}

export type TeacherReview = {
  teacher: {
    _id: string;
    name: string;
    alias?: string[]
    updatedAt?: string
  }
  general: {
    cr_medio: string | null
    cr_professor: string | null
    count: number;
    amount: number;
    numeric: number
    numericWeight: number;
    weight: number;
    distribution: Array<Distribution>
  }
  specific: Array<TeacherDetailedReview>
}

export type Component = {
	identifier: string;
	disciplina_id: number;
	subject: string;
	subjectId: string;
	turma: string;
	turno: "diurno" | "noturno";
	vagas: number;
	requisicoes: number;
	campus: "sbc" | "sa";
	teoria?: string;
	teoriaId?: string;
	pratica?: string;
	praticaId?: string;
};

export type MatriculaStudent =  {
  studentId: number;
  graduations: {
      courseId: number;
      name: string;
      shift: "Noturno" | "Matutino";
      affinity: number;
      cp: number;
      cr: number;
      ca: number
  }[];
}

type CreateStudent = {
  ra: string;
  login: string;
  graduations: {
      name: string;
      courseId: number;
      cp?: number | undefined;
      cr?: number | undefined;
      quads?: number | undefined;
      turno: string;
  }[];
  studentId?: number | undefined;
}

function resolveEndpoint() {
  if (import.meta.env.PROD) {
    return "https://api.v2.ufabcnext.com";
  }

  return "http://localhost:5000";
}

export const nextURL = resolveEndpoint()

export const nextService = ofetch.create({
  baseURL: nextURL,
});

export async function getStudentHistory(ra: number) {
  const studentHistory = await nextService<StudentHistory>(`/histories/me?ra=${ra}`);

  return studentHistory;
}

export async function createStudent(student: CreateStudent) {
  const createdStudent = await nextService("/entities/students", {
    method: "POST",
    body: student,
  });
  return createdStudent;
}

export async function syncHistory(student: SigHistory) {
  const syncedStudent = await nextService("/histories", {
    method: "POST",
    body: student,
  });
  return syncedStudent;
}

export async function getSubjectReviews(subjectId: string) {
  const reviews = await nextService<SubjectReview>(`/entities/subjects/reviews/${subjectId}`)
  return reviews;
}

export async function getTeacherReviews(teacherId: string) {
  const reviews = await nextService<TeacherReview>(`/entities/teachers/reviews/${teacherId}`)
  return reviews;
}

export async function getComponents() {
  const components = await nextService<Component[]>('/entities/components')
  return components;
}

export async function getKicksInfo(kickId: string, studentId: string) {
  const kicksData = await nextService(`/entities/components/${kickId}/kicks?studentId=${studentId}`)
  return kicksData;
}


export async function getStudent(login: string, ra: string) {
  const student = await nextService<MatriculaStudent>('/entities/students/student', {
    query: {
      login,
      ra
    }
  })

  return student;
}
