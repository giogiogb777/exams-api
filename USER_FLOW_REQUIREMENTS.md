# USER FLOW REQUIREMENTS - Team 2

**Document Version:** 1.0  
**Last Updated:** December 19, 2025  
**Status:** Ready for Development  
**Team:** Team 2 (User Flow)

user: each team member will have its own user:

john doe -> 
username: jdoe pass: Aa123123
username: jdoe_admin pass: Aa123123
username: jdoe_moderator pass: Aa123123

API_DOCS: 
https://exams-api.up.railway.app/api/docs#/

---

## **Overview**
Users can authenticate, take active exams, and view their test results in real-time with immediate feedback.

---

## **1. LOGIN PAGE**

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

## **2. TESTS LIST PAGE** (Active Tests)

### **Requirements**
- **Page URL:** `/tests` (only accessible when authenticated)
- **Initial Data Load:**
  - Call `GET /users/me` → Get current username and role
  - Call `GET /dictionaries/difficulties`
  - Call `GET /dictionaries/question-categories`
  - Call `GET /dictionaries/exam-categories`
  - Call `GET /tests?active=true` → Get active tests list

### **Display Components**

#### **Header/Info Section**
- Welcome message: "Welcome, [username] - [Role Label]"
- Role badges showing current user role (User/Moderator/Admin)

#### **Filter & Search Bar**
- **Search Input:** Filter tests by name (substring match, case-insensitive)
- **Category Dropdown:** Filter by exam category
- **Difficulty Dropdown:** Filter by difficulty level
- **Implementation:**
  - Use debounce (300-500ms) to reduce API calls
  - Frontend-side filtering (no additional API calls for filters)
  - Reset filters button

#### **Pagination**
- Display items per page: 10 (configurable via dropdown: 5, 10, 20)
- Show current page number and total count
- Next/Previous/Jump to page buttons
- Disable buttons appropriately (e.g., "Previous" on page 1)

#### **Refresh Button**
- Button to manually refresh the test list
- Show loading state during refresh

#### **Tests List Display**
Show each test as a card/row with:
- Test name
- Duration (minutes)
- Total points
- Category
- Difficulty
- "Start Test" button

### **User Actions**

#### **Start Test Flow**
1. User clicks "Start Test" button
2. Call `GET /tests/{id}` to fetch full test details including all questions
3. Navigate to test-taking page with populated question data
4. Show loading state while fetching

### **Error Handling**
- Display error message if test list fails to load
- Show "No tests available" if empty
- Handle test fetch errors gracefully

---

## **3. TEST TAKING PAGE**

### **Requirements**

### **Page Structure**
- **Sidebar/Header:** Test name, timer countdown, progress indicator
- **Main Area:** Single question display
- **Bottom:** Navigation buttons

### **Question Display**
Based on question type, render appropriately:

#### **TRUE_FALSE Questions**
- Display question text
- Show two buttons: "True" / "False"
- Visual indicator of selected answer

#### **SINGLE_CHOICE Questions**
- Display question text
- Show radio buttons or clickable option cards
- Display all answers
- Only one answer can be selected
- Visual highlight of selected option

#### **MULTIPLE_CHOICE Questions**
- Display question text
- Show checkboxes or clickable cards
- Display all answers
- Multiple answers can be selected (visual checkmarks)
- Allow user to select zero or more answers

### **Navigation Controls**
- **Previous Button:** Go to previous question (disabled on first question)
- **Next Button:** Go to next question (disabled on last question)
- **Submit Button:** Final submission button (only shown on last question)
- **Progress Indicator:** "Question X of Y"

### **Test Timer**
- Display countdown timer at top
- Show hours:minutes:seconds format
- Change color to red when 5 minutes remaining
- Warning modal when time expires
- Auto-submit if time expires

### **User Interactions**
- Allow navigating back and forth between questions
- Save answer selections in frontend state (don't auto-submit)
- Allow changing answers before final submission
- Show "Are you sure?" confirmation before submit

### **Submit Test Flow**
1. User clicks "Submit" button on last question
2. Show confirmation modal: "Are you sure you want to submit?"
3. On confirm, call `POST /tests/{id}/submit` with answers
4. Display loading state during submission

### **API Call Structure**
```typescript
POST /tests/{id}/submit
Body: {
  examId: number,
  questions: [
    { questionId: number, isCorrect: boolean }
  ]
}
```

## **4. TEST RESULTS PAGE**

### **Requirements**

#### **Display After Submission**
Show success modal with:
- Exam name
- Total points
- Your score
- Percentage
- "View Results" button

#### **Results Details Page**
- Test name and metadata
- Score: X/Y points (percentage)
- Question-by-question breakdown:
  - Question text
  - Your answer(s)
  - Correct answer(s)
  - Points earned
  - Visual indicator: ✅ Correct / ❌ Incorrect
- "Back to Tests" button

#### **No API Refresh Needed**
- Use response data from submit endpoint
- Don't make additional API calls for results

## **5. ADMIN PAGE **
- Content on admin page should be Coming soon...
- Admin page only should be visible if user logs in with role Admin/Moderator

### BONUS: 
- Validate form and dont let user submit if required questions is not filled, differ required and non-required questions from each-other.