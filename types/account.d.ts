declare namespace API {
  interface LoginForm extends Pick<CX.User, 'username' | 'password'> { }

  interface User extends CX.User { }

  interface Account extends CX.AccountWithoutPassword {
    selected: boolean
  }

  interface Setting extends CX.Setting { }

  interface AccountInfo extends CX.AccountInfo { }

  interface Course extends CX.Course {
    isSigning?: boolean
    isLoadActivity?: boolean
  }

  interface Activity extends CX.Activity {
    result?: string
  }
}
