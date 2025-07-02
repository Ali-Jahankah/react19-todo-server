import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { ITodoCreateInput } from '../types/todos';
export const getTodos = async (_req: Request, res: Response): Promise<void> => {
  try {
    const todos = await prisma.todo.findMany();
    res.json(todos);
  } catch (error) {
    console.log('Faild to fetch todos', error);
    res
      .status(500)
      .json({ error: 'Internal server error while fetching todos' });
  }
};
export const createTodo = async (
  req: Request<{}, {}, ITodoCreateInput>,
  res: Response
): Promise<void> => {
  try {
    const { title, description, date, completed = false } = req.body;
    console.log(typeof completed);
    if (!title || !description || !date) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        date: new Date(date),
        completed
      }
    });
    res.status(201).json(todo);
  } catch (error) {
    console.log('Faild to create todo: ', error);
    res.status(500).json({ error: 'Internal server error in creating a todo' });
  }
};
