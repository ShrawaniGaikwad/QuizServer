const express = require('express');
const router = express.Router();
const cors=require('cors');
const mongoose = require('mongoose');
router.use(express.json());
const db = "mongodb+srv://shrawanigaikwad5:h9Lz1DXVVHsa1CZo@project.p9zw7sy.mongodb.net/LegalLift?retryWrites=true&w=majority&appName=Project";
const app=express();
app.use(cors());
mongoose.connect(db).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

const quizSchema = new mongoose.Schema({
    title: String,
    questions: [{
        question: String,
        options: [String],
        correctAnswer: String
    }],
    id: { type: String, unique: true, required: true },
    createdBy: { type: String, ref: 'User' }
});

const Quiz = mongoose.model('createquiz', quizSchema, 'createquiz');

router.post('/createquiz', async (req, res) => {
    try {
        console.log('POST /createquiz called');
        console.log('Request Body:', req.body);
        const newQuiz = new Quiz(req.body);
        const savedQuiz = await newQuiz.save();
        console.log('Quiz data saved successfully:', savedQuiz);
        res.json({ message: 'Quiz data added successfully', newQuiz: savedQuiz });
    } catch (error) {
        console.error('Error saving quiz data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/quiz/:id', async (req, res) => {
    const quizId = req.params.id;
    console.log(`GET /quiz/${quizId} called`);
  
    try {
      const quiz = await Quiz.findOne({ id: quizId });
      if (!quiz) {
        console.log('Quiz not found');
        return res.status(404).json({ message: 'Quiz not found' });
      }
      res.json(quiz);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      res.status(500).json({ message: 'Error fetching quiz' });
    }
  });

  router.get('/quizzes/user/:userId', async (req, res) => {
    const userId = req.params.userId.trim();
    console.log(userId);
    console.log(`GET /quizzes/user/${userId} called`);

    try {
        const quizzes = await Quiz.find({ createdBy: userId  });
        console.log(quizzes);
        res.json(quizzes);
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).json({ message: 'Error fetching quizzes' });
    }
});

const PORT = process.env.PORT || 3000;
app.use(router);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});