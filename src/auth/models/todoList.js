'use strict';

const todoListModel = (sequelize, DataTypes) => {
  const todos = sequelize.define('Todo', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    todos: {
      type: DataTypes.STRING
    },
    difficulty: {
      type: DataTypes.INTEGER
    }
  });
  return todos;
}

module.exports = todoListModel;
