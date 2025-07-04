import { ITodoCreateInput } from './../types/todos';
import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { Prisma, Todo } from '@prisma/client';
export const getTodos = async (
  _req: Request,
  res: Response<Todo[] | { error: string }>
): Promise<void> => {
  try {
    const todos = await prisma.todo.findMany();
    res.json(todos);
  } catch (error) {
    console.log('Failed to fetch todos', error);
    res
      .status(500)
      .json({ error: 'Internal server error while fetching todos' });
  }
};
export const createTodo = async (
  req: Request<{}, {}, ITodoCreateInput>,
  res: Response<Todo | { error: string }>
): Promise<void> => {
  try {
    const { title, description, date, completed = false } = req.body;
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
export const deleteTodo = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    await prisma.todo.delete({
      where: {
        id: Number(id)
      }
    });
    res.status(204).send();
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      res.status(404).json({ error: 'Todo not found!' });
      return;
    }
    console.log('Faild to delete todo: ', error);
    res.status(400).json({ error: 'Server error while deleting a todo' });
  }
};
export const updateTodo = async (
  req: Request<{ id: string }, {}, ITodoCreateInput>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (data.date) {
      data.date = new Date(data.date).toISOString();
    }
    const selectedTodo = await prisma.todo.update({
      where: {
        id: Number(id)
      },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined
      }
    });
    res.json(selectedTodo);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      res.status(404).json({ error: 'Todo not found!' });
      return;
    }
    console.log('Faild to update todo ', error);
    res
      .status(500)
      .json({ error: 'Internal server error while updating todo' });
  }
};
