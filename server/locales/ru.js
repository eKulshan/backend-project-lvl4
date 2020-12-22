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
      authorizeError: 'Доступ запрещен! Можно редактировать только свои данные.',
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
        createdAt: 'Создан',
        updatedAt: 'Изменен',
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
      statuses: {
        index: {
          id: 'ID',
          name: 'Название',
          createdAt: 'Создан',
          updatedAt: 'Изменен',
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
      tasks: {
        index: {
          id: 'ID',
          name: 'Название',
          description: 'Описание',
          status_id: 'Статус',
          creator_id: 'Создатель',
          executor_id: 'Исполнитель',
          createdAt: 'Создан',
          updatedAt: 'Изменен',
          edit: 'Редактировать',
          delete: 'Удалить',
          create: 'Создать',
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
