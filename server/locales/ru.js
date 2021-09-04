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
      tasks: {
        create: {
          error: 'Не удалось создать задачу',
          success: 'Задача успешно создана',
        },
        update: {
          error: 'Не удалось изменить задачу',
          success: 'Задача успешно изменена',
        },
        delete: {
          error: 'Не удалось удалить задачу',
          success: 'Задача успешно удалена',
          notAllowed: 'Задачу может удалить только её автор',
        },
      },
      statuses: {
        create: {
          error: 'Не удалось создать статус',
          success: 'Статус успешно создан',
        },
        update: {
          error: 'Не удалось изменить статус',
          success: 'Статус успешно изменён',
          notAllowed: 'Нельзя изменить статус другого пользователя',
          notFound: 'Статус не найден',
        },
        delete: {
          error: 'Не удалось удалить статус',
          success: 'Статус успешно удалён',
          notAllowed: 'Нельзя удалить статус другого пользователя',
        },
      },
      labels: {
        create: {
          error: 'Не удалось создать метку',
          success: 'Метка успешно создана',
        },
        update: {
          error: 'Не удалось изменить метку',
          success: 'Метка успешно изменена',
        },
        delete: {
          error: 'Не удалось удалить метку',
          success: 'Метка успешно удалена',
        },
      },
      users: {
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        update: {
          error: 'Не удалось изменить пользователя',
          success: 'Пользователь успешно изменён',
          notAllowed: 'Нельзя изменить другого пользователя',
          notFound: 'Пользователь не найден',
        },
        delete: {
          error: 'Не удалось удалить пользователя',
          success: 'Пользователь успешно удалён',
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
        labelsNew: 'Создать метку',
        labels: 'Метки',
        tasks: 'Задачи',
      },
      tasks: {
        create: 'Создать задачу',
        own: 'Только мои задачи',
        status: 'Статус',
        executor: 'Исполнитель',
        label: 'Метки',
        submit: 'Показать',
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
        action: 'Действия',
        delete: 'Удалить',
        new: {
          create: 'Создание статуса',
          name: 'Наименование',
          submit: 'Создать',
        },
        edit: {
          edit: 'Изменение статуса',
          name: 'Наименование',
          submit: 'Изменить',
        },
      },
      labels: {
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        action: 'Действия',
        delete: 'Удалить',
        new: {
          create: 'Создание метки',
          name: 'Наименование',
          submit: 'Создать',
        },
        edit: {
          edit: 'Изменение ветки',
          name: 'Наименование',
          submit: 'Изменить',
        },
      },
      tasks: {
        id: 'ID',
        name: 'Наименование',
        status: 'Статус',
        author: 'Автор',
        label: 'Метка',
        labels: 'Метки:',
        executor: 'Исполнитель',
        createdAt: 'Дата создания',
        action: 'Действия',
        delete: 'Удалить',
        show: 'Показать',
        new: {
          create: 'Создание задачи',
          name: 'Наименование',
          description: 'Описание',
          status: 'Статус',
          executor: 'Исполнитель',
          labels: 'Метки',
          submit: 'Создать',
        },
        edit: {
          edit: 'Изменение задачи',
          name: 'Наименование',
          description: 'Описание',
          status: 'Статус',
          executor: 'Исполнитель',
          labels: 'Метки',
          submit: 'Изменить',
        },
      },
      users: {
        id: 'ID',
        email: 'Email',
        fullName: 'Полное имя',
        createdAt: 'Дата создания',
        action: 'Действия',
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
