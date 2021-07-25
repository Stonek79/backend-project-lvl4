// @ts-check

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
      statuses: {
        create: {
          error: 'Не удалось установить статус',
          success: 'Статус успешно создан',
        },
        update: {
          error: 'Не удалось изменить статус',
          success: 'Статус успешно изменен',
          notAllowed: 'Нельзя изменить статус другого пользователя',
          notFound: 'Статус не найден',
        },
        delete: {
          error: 'Не удалось удалить статус',
          success: 'Статус успешно удален',
          notAllowed: 'Нельзя удалить статус другого пользователя',
        },
      },
      users: {
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        update: {
          error: 'Не удалось изменить пользователя',
          success: 'Пользователь успешно изменен',
          notAllowed: 'Нельзя изменить другого пользователя',
          notFound: 'Пользователь не найден',
        },
        delete: {
          error: 'Не удалось удалить пользователя',
          success: 'Пользователь успешно удален',
          notAllowed: 'Нельзя удалить другого пользователя',
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
        statuses: 'Статусы',
        statusesNew: 'Создать статус',
        labels: 'Метки',
        tasks: 'Задачи',
      },
    },
    views: {
      session: {
        new: {
          signIn: 'Вход',
          email: 'Email',
          password: 'Пароль',
          submit: 'Войти',
        },
      },
      statuses: {
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        delete: 'Удалить',
        new: {
          create: 'Создание статуса',
          name: 'Наименование',
          submit: 'Создать',
        },
        edit: {
          edit: 'Изменение статуса',
          name: 'Имя',
          submit: 'Изменить',
        },
      },
      users: {
        id: 'ID',
        email: 'Email',
        fullName: 'Полное имя',
        createdAt: 'Дата создания',
        delete: 'Удалить',
        new: {
          signUp: 'Регистрация',
          firstname: 'Имя',
          lastname: 'Фамилия',
          email: 'Email',
          password: 'Пароль',
          submit: 'Сохранить',
        },
        edit: {
          edit: 'Изменение пользователя',
          firstname: 'Имя',
          lastname: 'Фамилия',
          email: 'Email',
          password: 'Пароль',
          submit: 'Изменить',
        },
      },
      welcome: {
        index: {
          hello: 'Привет от Хекслета!',
          description: 'Практические курсы по программированию',
          more: 'Узнать Больше',
        },
      },
    },
  },
};
