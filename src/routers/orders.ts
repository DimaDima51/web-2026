import express from 'express';
import * as orders from "../controllers/orders.ts";
import { validateBody, validateObjectId } from '../middlewares/validation.ts';
import { requireAuth } from '../middlewares/auth.ts';

const router = express.Router();
const body = validateBody(["items", "status"]);
router.all("/:id", requireAuth, validateObjectId);

/**
 * @openapi
 * /orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Получение всех заказов
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список заказов успешно получен
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         description: Ошибка при получении списка заказов
 */
router.get('/', requireAuth, orders.listOrders);

/**
 * @openapi
 * /orders:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Создание заказа
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Заказ успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         description: Ошибка при создании заказа
 */
router.post('/', requireAuth, orders.createOrder);

/**
 * @openapi
 * /orders/{id}:
 *   patch:
 *     tags:
 *       - Orders
 *     summary: Обновление заказа
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required: [product, quantity]
 *                   properties:
 *                     product:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *               status:
 *                 type: string
 *                 enum: [new, processing, completed, cancelled]
 *     responses:
 *       200:
 *         description: Заказ успешно обновлён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         description: Ошибка при обновлении заказа
 */
router.patch('/:id', requireAuth, orders.updateOrder);

/**
 * @openapi
 * /orders/{id}:
 *   delete:
 *     tags:
 *       - Orders
 *     summary: Удаление заказа
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Заказ успешно удалён
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         description: Ошибка при удалении заказа
 */
router.delete('/:id', requireAuth, orders.deleteOrder);

/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Получение заказа по ID
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Информация о заказе успешно получена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         description: Ошибка при получении заказа
 */
router.get('/:id', requireAuth, orders.getOrder);

export default router;
