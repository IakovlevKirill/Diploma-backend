// test.routes.ts
import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: Проверка работы API
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: сасамба епта, все работает
 */
router.get('/test', (req, res) => {
    res.json({ test: "это сообщение получено от сервера" });
});

export default router;