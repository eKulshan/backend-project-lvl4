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
          error: 'Не удалось зарегистрировать пользователя',
          success: 'Пользователь успешно зарегистрирован',
        },
        update: {
          error: 'Не удалось обновить пользователя',
          success: 'Пользователь успешно обновлен',
        },
        delete: {
          error: 'Не удалось удалить пользователя',
          success: 'Пользователь успешно удален',
        },
      },
      statuses: {
        create: {
          error: 'Не удалось cоздать статус',
          success: 'Статус успешно создан',
        },
        update: {
          error: 'Не удалось обновить статус',
          success: 'Статус успешно обновлен',
        },
        delete: {
          error: 'Не удалось удалить статус',
          success: 'Статус успешно удален',
        },
      },
      labels: {
        create: {
          error: 'Не удалось cоздать метку',
          success: 'Метка успешно создана',
        },
        update: {
          error: 'Не удалось обновить метку',
          success: 'Метка успешно обновлена',
        },
        delete: {
          error: 'Не удалось удалить метку',
          success: 'Метка успешно удалена',
        },
      },
      tasks: {
        create: {
          error: 'Не удалось cоздать задачу',
          success: 'Задача успешно создана',
        },
        update: {
          error: 'Не удалось обновить задачу',
          success: 'Задача успешно обновлена',
        },
        delete: {
          error: 'Не удалось удалить задачу',
          success: 'Задача успешно удалена',
        },
      },
      authenticateError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
      authorizeError: 'Доступ запрещен! У вас нет прав на это действие.',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
        updateProfile: 'Изменить профиль',
        deleteProfile: 'Удалить профиль',
        statuses: 'Статусы',
        tasks: 'Задачи',
        labels: 'Метки',
      },
    },
    views: {
      session: {
        new: {
          signIn: 'Вход',
          submit: 'Войти',
          email: 'Email',
          password: 'Пароль',
        },
      },
      users: {
        id: 'ID',
        firstName: 'Имя',
        lastName: 'Фамилия',
        email: 'Email',
        createdAt: 'Создан',
        updatedAt: 'Изменен',
        new: {
          submit: 'Сохранить',
          signUp: 'Регистрация',
          email: 'Email',
          password: 'Пароль',
          firstname: 'Имя',
          lastname: 'Фамилия',
        },
        edit: {
          edit: 'Редактировать профиль',
          submit: 'Сохранить',
          signUp: 'Регистрация',
          email: 'Email',
          password: 'Пароль',
          firstname: 'Имя',
          lastname: 'Фамилия',
        },
      },
      welcome: {
        index: {
          hello: 'Вас приветствует Менеджер Задач!',
          description: 'Эффективно планируйте достижение своих целей',
          more: 'Узнать Больше',
        },
      },
      statuses: {
        index: {
          id: 'ID',
          name: 'Название',
          edit: 'Редактировать',
          delete: 'Удалить',
          create: 'Создать',
        },
        new: {
          create: 'Создать статус',
          submit: 'Сохранить',
        },
        edit: {
          edit: 'Редактировать статус',
          submit: 'Сохранить',
        },
      },
      labels: {
        index: {
          id: 'ID',
          name: 'Название',
          edit: 'Редактировать',
          delete: 'Удалить',
          create: 'Создать',
        },
        new: {
          create: 'Создать метку',
          submit: 'Сохранить',
        },
        edit: {
          edit: 'Редактировать метку',
          submit: 'Сохранить',
        },
      },
      tasks: {
        index: {
          id: 'ID',
          name: 'Название',
          description: 'Описание',
          status_id: 'Статус',
          labels: 'Метки',
          creator_id: 'Создатель',
          executor_id: 'Исполнитель',
          createdAt: 'Создан',
          updatedAt: 'Изменен',
          edit: 'Редактировать',
          delete: 'Удалить',
          create: 'Создать задачу',
        },
        new: {
          create: 'Создать задачу',
          submit: 'Сохранить',
        },
        edit: {
          edit: 'Редактировать задачу',
          submit: 'Сохранить',
        },
      },
    },
  },
};
