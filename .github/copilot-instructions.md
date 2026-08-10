# Hospital Management System - Architecture & Coding Standards

## Architecture Style
- Domain-Driven Design (DDD) with Clean / Hexagonal Architecture principles.
- Strict separation of layers: Domain, Application, Infrastructure, Presentation.

## Coding Rules
- Language: TypeScript (Strict mode enabled).
- Backend Framework: NestJS.
- Frontend Framework: React (Next.js App Router).
- Database: PostgreSQL with Prisma ORM.
- Always write unit tests (Jest for backend, React Testing Library / Vitest for frontend).
- Use Value Objects for identifiers (e.g., PatientId) and business boundaries.
- Domain layer must have ZERO dependencies on frameworks (NestJS/Prisma).