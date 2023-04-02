declare namespace API {
  interface LoginForm extends Pick<CX.User, 'username' | 'password'> { }

  interface User extends CX.User { }

  interface Course extends CX.Course {
    isSigning?: boolean
    isLoadActivity?: boolean
  }

  interface Activity extends CX.Activity {
    result?: string
  }
}
