import { Router } from 'express';
import { getTodos, createTodo } from '../controllers/todoController';

const router = Router();

router.get('/', getTodos);
router.post('/', createTodo);

export default router;
