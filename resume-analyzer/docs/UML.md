# UML Diagrams (PlantUML source)

Render any block at https://www.plantuml.com/plantuml, in VS Code (PlantUML extension), or import into draw.io (Arrange > Insert > Advanced > PlantUML). Export PNGs for your report.

## 1. Use case diagram
```plantuml
@startuml
left to right direction
actor "Candidate / User" as U
actor Admin as A
actor "AI Service" as AI
rectangle "ResumeLens" {
  usecase "Register" as UC1
  usecase "Login / Logout" as UC2
  usecase "Upload PDF resume" as UC3
  usecase "Validate PDF and extract text" as UC4
  usecase "Analyze resume" as UC5
  usecase "View score, strengths,\nweaknesses, recommendations" as UC6
  usecase "View / delete analysis history" as UC7
  usecase "Manage profile" as UC8
  usecase "View statistics" as UC9
  usecase "Activate / disable users" as UC10
}
U --> UC1
U --> UC2
U --> UC3
U --> UC6
U --> UC7
U --> UC8
A --> UC2
A --> UC9
A --> UC10
UC3 ..> UC4 : <<include>>
UC5 ..> UC4 : <<include>>
UC3 ..> UC5 : <<extend>>
UC5 --> AI
@enduml
```

## 2. Class diagram
```plantuml
@startuml
class User {
  +ObjectId _id
  +String name
  +String email
  -String passwordHash
  +String role  // user | admin
  +Boolean isActive
  +Date createdAt
  +matchPassword(plain): Boolean
}
class Resume {
  +ObjectId _id
  +ObjectId userId
  +String originalFileName
  +String storedFileName
  +Number fileSize
  +Number pageCount
  +String extractedText
  +Date uploadedAt
}
class ResumeAnalysis {
  +ObjectId _id
  +ObjectId userId
  +ObjectId resumeId
  +Number overallScore
  +CategoryScores categoryScores
  +String summary
  +String[] skills
  +String[] strengths
  +String[] weaknesses
  +String[] missingKeywords
  +String[] recommendations
  +String aiModel
  +Date createdAt
}
class CategoryScores {
  skills, experience, education,
  projects, keywords, structure, contentQuality
}
class PdfService {
  +processPdf(path): {text, pageCount}
}
class AIService {
  +analyzeResume(text): AnalysisResult
  -callModel(message)
  -parseJson(text)
}
class AIResponseValidator {
  +validateAnalysis(raw): AnalysisResult
}
User "1" --> "0..*" Resume : uploads
Resume "1" --> "0..*" ResumeAnalysis : has
User "1" --> "0..*" ResumeAnalysis : owns
ResumeAnalysis *-- CategoryScores
AIService ..> AIResponseValidator : uses
@enduml
```

## 3. Activity diagram (resume analysis)
```plantuml
@startuml
start
:User logs in;
:Select PDF resume;
if (PDF type and size valid in browser?) then (no)
  :Show error;
  stop
endif
:Upload to server;
if (Real PDF? (signature check)) then (no)
  :Delete file, return 400;
  stop
endif
:Extract and clean text;
if (Readable text found?) then (no)
  :Delete file, return 422;
  stop
endif
:Save Resume in MongoDB;
:Send text to AI service;
if (Valid JSON returned?) then (no)
  :Return friendly error (502);
  stop
endif
:Validate and clamp scores;
:Calculate overall score;
:Save ResumeAnalysis;
:Display result dashboard;
stop
@enduml
```

## 4. Sequence diagram
```plantuml
@startuml
actor User
participant "React Client" as C
participant "Express API" as API
participant PdfService
participant AIService
database MongoDB
participant "AI Provider" as AI
User -> C : choose PDF, click Analyze
C -> API : POST /api/resumes/upload (JWT, file)
API -> API : protect + authorize + multer limits
API -> PdfService : processPdf(file)
PdfService --> API : text, pageCount
API -> MongoDB : save Resume
API --> C : 201 resume
C -> API : POST /api/analysis/:resumeId
API -> MongoDB : find Resume (+text)
API -> AIService : analyzeResume(text)
AIService -> AI : request (API key from .env)
AI --> AIService : JSON text
AIService -> AIService : parse + validate + clamp
AIService --> API : result
API -> MongoDB : save ResumeAnalysis
API --> C : 201 analysis
C --> User : show score and feedback
@enduml
```

## 5. Component diagram
```plantuml
@startuml
package "Client (React + Vite)" {
  [Pages] --> [Components]
  [Pages] --> [Auth Context]
  [Pages] --> [Services (Axios)]
}
package "Server (Node + Express)" {
  [Routes] --> [Middleware]
  [Routes] --> [Controllers]
  [Controllers] --> [PdfService]
  [Controllers] --> [AnalysisService]
  [AnalysisService] --> [AIService]
  [AIService] --> [AIResponseValidator]
  [Controllers] --> [Mongoose Models]
}
database MongoDB
cloud "AI Provider API" as AI
[Services (Axios)] --> [Routes] : REST / JSON
[Mongoose Models] --> MongoDB
[AIService] --> AI : HTTPS
@enduml
```

## 6. Deployment diagram
```plantuml
@startuml
node "User device" {
  artifact "Browser\n(React build)" as B
}
node "Web server / PaaS" {
  artifact "Static client files" as S
  artifact "Express API\n(Node.js)" as API
  folder "uploads/ (PDFs)" as F
  file ".env (secrets)" as E
}
database "MongoDB Atlas / local" as DB
cloud "AI Provider" as AI
B --> S : HTTPS
B --> API : HTTPS REST (JWT)
API --> DB : Mongoose
API --> F : read / write
API --> AI : HTTPS (API key)
API ..> E : reads at start
@enduml
```
