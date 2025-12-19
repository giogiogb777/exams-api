# ADMIN FLOW REQUIREMENTS - Team 1

**Document Version:** 1.0  
**Last Updated:** December 19, 2025  
**Status:** Ready for Development  
**Team:** Team 1 (Admin Flow)

john doe -> 
username: jdoe pass: Aa123123
username: jdoe_admin pass: Aa123123
username: jdoe_moderator pass: Aa123123

---

## **Overview**
Admins create, manage, and edit exams. Moderators can view exams, control their availability (pause/play), and manage test results.

---

## **1. ADMIN LAYOUT**

## **1.1. LOGIN PAGE**

### **Requirements**
- **Layout:** Simple, clean interface with two input fields
- **Fields:**
  - Username input
  - Password input (masked)
  - "Remember me" checkbox
- **Credentials Storage:**
  - When "Remember me" is checked and next time user tries to login the username and password field must be pre-filled. if user unmarks it on next login it should be cleared

### **Accessibility Rules**
- ❌ Login page must NOT be accessible to authenticated users
- Redirect logged-in users to `/tests` page automatically

### **API Calls**
```
POST /auth/login
Body: { username: string, password: string }
Response: { access_token: string }
```

### **Error Handling**
- Display clear error message for invalid credentials
- Show "Credentials saved" confirmation when "Remember me" is used
- Handle network errors gracefully

---

### **Navigation**
- Sidebar with two menu items:
  1. **Dashboard** (Coming soon...)
  2. **Exams** (Only visible to Moderator/Admin)

### **Access Control**
- ❌ Admin page only accessible if user has MODERATOR or ADMIN role
- Redirect non-admin users to tests page
- Display "Coming soon..." for dashboard

---

## **2. EXAMS LIST PAGE**

### **Initial Data Load**
- Call `GET /admin/exams/list/without-questions` → Get exam list
- Call `GET /dictionaries/statuses` → Get status values (Active/Inactive)

### **Display Components**

#### **Filter & Search**
- **Search Input:** Filter by exam name (substring match)
- **Status Filter:** Filter by Active/Inactive (dropdown)
- **Implementation:**
  - Frontend-side filtering for better UX
  - Debounce search input (300-500ms)

#### **Pagination**
- Configurable items per page: 10, 20, 50
- Current page and total count display
- Navigation buttons

#### **Refresh Button**
- Manually refresh exam list
- Show loading state

#### **Exam List Display**
Show each exam as a row/card with:
- Exam name
- Duration
- Total points
- Category
- Difficulty
- Status (Active/Inactive with visual indicator)
- Action buttons

#### **User Actions & Permissions**

##### **Action Buttons**

1. **Pause/Play Buttons**
   - **Play Button:** 
     - Only visible if exam is Inactive (status = 2)
     - Makes exam available to users
     - Call: `PATCH /admin/exams/{id}/toggle-active`
   
   - **Pause Button:**
     - Only visible if exam is Active (status = 1)
     - Hides exam from users
     - Call: `PATCH /admin/exams/{id}/toggle-active`
   
   - Show confirmation before toggle

2. **View Button:**
   - Visible to Moderator and Admin
   - Opens exam details in view-only mode
   - Questions list is read-only
   - No edit/delete/add buttons visible

3. **Edit Button:**
   - **Only visible to ADMIN role**
   - Opens exam details for editing
   - All question management available
   - Moderators cannot see this button

4. **Add Exam Button** (top right)
   - **Only visible to ADMIN role**
   - Opens form to create new exam
   - Moderators cannot see this button

#### **Role Permissions Matrix**

| Action | Admin | Moderator |
|--------|-------|-----------|
| View Exam | ✅ | ✅ |
| Edit Exam | ✅ | ❌ |
| Add Exam | ✅ | ❌ |
| Delete Exam | ✅ | ❌ |
| Add Question | ✅ | ❌ |
| Edit Question | ✅ | ❌ |
| Delete Question | ✅ | ❌ |
| Pause/Play Exam | ✅ | ✅ |

---

## **3. EXAM DETAILS PAGE (View/Edit)**

### **Initial Data Load**
- Call `GET /admin/exams/{id}` → Full exam details + all questions
- Call `GET /dictionaries/question-categories`
- Call `GET /dictionaries/difficulties`
- Call `GET /dictionaries/exam-categories`

### **Top Section - Exam Metadata**
Display (read-only in view mode):
- Exam name
- Duration
- Total points
- Category
- Difficulty
- Created/Updated dates

### **Questions Section**

#### **Questions List Display**
- **Pagination:** Questions per page dropdown (10, 20, 50)
- **Filters:**
  - Search by question name (substring)
  - Filter by question category
  - Filter by difficulty
- **Column Display:**
  - Question text (truncated)
  - Category badge
  - Difficulty badge
  - Points
  - Is Required? (Yes/No indicator)
  - Action buttons

#### **View Mode (Moderator or when viewing)**
- All information displayed read-only
- Action buttons disabled/hidden:
  - No "Add Question" button
  - No "Edit" button on questions
  - No "Delete" button on questions
  - No "Clone" button on questions
- Visual indicator: "View Mode" label at top

#### **Edit Mode (Admin only)**
Action buttons per question:
1. **Add Question Button** (top right)
   - Opens form to add new question
   - Form is empty/blank
   - Save on submit

2. **Edit Button** (per question)
   - Opens form with pre-filled question data
   - Modify fields and save
   - Call: `PUT /admin/exams/{id}` with updated full exam data

3. **Clone Button** (per question)
   - Create copy of question in same exam
   - Open form with cloned data pre-filled
   - Allow modification before save
   - Save as new question

4. **Delete Button** (per question)
   - Show confirmation modal
   - On confirm, remove question from list
   - Call: `PUT /admin/exams/{id}` with remaining questions

### **Add/Edit Question Form**

#### **Form Fields**

##### **For All Questions:**
- **Question Text** (required)
- **Category** (dropdown: True/False, Single Choice, Multiple Choice)
- **Points** (number, positive)
- **Is Required?** (checkbox)
- **Difficulty** (dropdown)

##### **Conditional Fields - TRUE_FALSE:**
- **Correct Answer** (boolean toggle: True/False)
- Hide "Answers" section

##### **Conditional Fields - SINGLE_CHOICE / MULTIPLE_CHOICE:**
- **Answers Section** (dynamic list):
  - Text input for answer
  - "Is Correct?" checkbox per answer
  - "Add Answer" button
  - "Remove Answer" button per item
- Hide "Correct Answer" boolean toggle
- At least one answer must be marked correct (validation)

#### **Form Validation**
- Question text is required
- Points must be positive number
- TRUE_FALSE: correctAnswer must be set
- CHOICE types: at least one answer marked correct
- All answers must have text
- **Total points validation:** After all questions added, sum must equal exam totalPoint

#### **Save Logic**
1. Validate form
2. Call `PUT /admin/exams/{id}` with complete exam data
3. Include ALL existing questions + new/modified question
4. Show success message
5. Refresh questions list
6. Close form

#### **Error Handling**
- Display validation errors clearly
- Show API error messages
- Handle network failures gracefully

---

## **4. CREATE NEW EXAM PAGE**

### **Requirements**
- Only accessible to ADMIN role
- Similar form to exam details page
- Fields for exam metadata (name, duration, points, category, difficulty)
- Start with one blank question slot
- User can add multiple questions before saving
- Validations:
  - Sum of question points = total points
  - At least one question required
  - All category-specific rules apply

### **Form Fields**

#### **Exam Metadata**
- **Exam Name** (required, string)
- **Duration** (required, number in minutes)
- **Total Points** (required, number - positive)
- **Category** (required, dropdown)
- **Difficulty** (required, dropdown)

#### **Questions Section**
- Start with one empty question slot
- "Add Another Question" button
- Each question has all fields from Add/Edit form

### **Validation Before Submit**
- All metadata fields filled
- At least one question added
- All questions have required fields
- **Critical:** Sum of all question points = Total Points value
- Cannot submit if validation fails - show clear error message

### **API Call**
```
POST /admin/exams
Body: {
  examName: string,
  examDuration: number,
  totalPoint: number,
  category: string,
  difficulty: string,
  questions: [...] // Array of questions
}
```

### **Success Flow**
1. Submit validated form
2. Show loading state
3. On success: Show "Exam created successfully" message
4. Redirect to exam list page
5. Display newly created exam in list

### **Error Handling**
- Display validation errors with field highlights
- Show API errors clearly
- Allow user to go back and fix data

---