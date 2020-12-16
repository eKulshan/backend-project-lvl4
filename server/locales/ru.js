module.exports = {
  translation: {
    appName: 'Менеджер задач',
    flash: {
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный емейл или пароль',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      users: {
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        update: {
          success: 'Пользователь успешно обновлен',
        },
        delete: {
          success: 'Пользователь успешно удален',
        },
      },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
        updateProfile: 'Изменить профиль',
        deleteProfile: 'Удалить профиль',
      },
    },
    views: {
      session: {
        new: {
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      users: {
        id: 'ID',
        firstName: 'Имя',
        lastName: 'Фамилия',
        email: 'Email',
        createdAt: 'Дата создания',
        updatedAt: 'Дата изменения',
        new: {
          submit: 'Сохранить',
          signUp: 'Регистрация',
        },
        edit: 'Редактировать профиль',
      },
      welcome: {
        index: {
          hello: 'Вас приветствует Менеджер Задач!',
          description: 'Эффективно планируйте достижение своих целей',
          more: 'Узнать Больше',
        },
      },
    },
  },
};
