flowchart TD
    Start[Start] --> Decision{New user}
    Decision -->|Yes| SignUp[Sign Up page]
    Decision -->|No| SignIn[Sign In page]
    SignUp --> Auth[POST auth API]
    SignIn --> Auth
    Auth -->|Success| Dashboard[Dashboard]
    Auth -->|Fail| Error[Show error]
    Dashboard --> Widget[Click widget]
    Widget --> Detail[Detail page]
    Dashboard --> SignOut[Sign Out]
    SignOut --> SignIn