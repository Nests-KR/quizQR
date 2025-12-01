const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const restartButton = document.getElementById('restart-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const quizHeaderElement = document.getElementById('quiz-header');
const resultContainerElement = document.getElementById('result-container');
const scoreElement = document.getElementById('score');

let shuffledQuestions, currentQuestionIndex;
let score = 0;
let selectedImage = null;

const questions = [
    {
        type: 'short-answer',
        question: '1. "모두콘 2025"의 메인 슬로건은 무엇인가?',
        answer: 'From AI to Infinity',
        translation: '1. What is the main slogan of "Moducon 2025"?'
    },
    {
        type: 'multiple-choice',
        question: '2. 금일 진행된 모두콘을 주관하는 단체는 어디인가?',
        answers: [
            { text: '이화여대 창업지원단.', correct: false },
            { text: '이화여대 AIX 사업단.', correct: false },
            { text: '모두의 연구소.', correct: false },
            { text: '3개 전부', correct: true }
        ],
        translation: '2. Which organization is hosting Moducon today?'
    },
    {
        type: 'ox',
        question: '3. 모두콘 2025는 이화여대 ECC홀에서 개최한다',
        answer: true,
        translation: '3. Moducon 2025 will be held at Ewha Womans University-ECC Hall. (O/X)'
    },
    {
        type: 'drag-and-drop',
        question: '4. 각 트랙에 맞는 이미지를 드래그하여 연결하세요.',
        targets: [
            { id: 1, text: 'Track 00' },
            { id: 2, text: 'Track 01' },
            { id: 3, text: 'Track 10' },
            { id: 4, text: 'Track i' },
            { id: 5, text: 'Track 100' },
            { id: 6, text: 'Track 101' }

        ],
        images: [
            { id: 1, img: 'images/Group 1.png' },
            { id: 2, img: 'images/Group 2.png' },
            { id: 3, img: 'images/Group 3.png' },
            { id: 4, img: 'images/Group 6.png' },
            { id: 5, img: 'images/Group 4.png' },
            { id: 6, img: 'images/Group 5.png' }
        ],
        translation: '4. Connect the images to the corresponding tracks.'
    },
    {
        type: 'multiple-choice',
        question: '5. 모두콘이 처음으로 개최된 년도는?',
        answers: [
            { text: '2018', correct: true },
            { text: '2020', correct: false },
            { text: '2022', correct: false },
            { text: '2025', correct: false }
        ],
        translation: '5. What year was Moducon first held?'
    },
    {
        type: 'multiple-choice',
        question: '6. 모두콘 내에서 포스터 전시를 실시하고 있는 트랙은?',
        answers: [
            { text: 'Track 10', correct: false },
            { text: 'Track 100', correct: true },
            { text: 'Track 101', correct: false },
            { text: 'Track 01', correct: false }
        ],
        translation: '6. Which track is holding a poster exhibition within Moducon?'
    },
    {
        type: 'short-answer',
        question: '7. [모두연 창립 __주년의 성장을 기념하여 노정성 대표님을 모시고 아시아 최초 구글 매각부터 AI 뷰티혁신까지 6번의 창업 경험과 인사이트를 공유합니다.]\n 빈칸에 들어갈 숫자는 몇 주년 일까요?',
        answer: '10',
        translation: '7. [In commemoration of the __th anniversary of the founding of Modu, we invite CEO Noh Jeong-seong to share his 6 startup experiences and insights, from the first Google sale in Asia to AI beauty innovation.] What is the number that goes in the blank?'
    },
    {
        type: 'multiple-choice',
        question: '8. 모두콘 2025의 시작 시간과 마무리 시간은??',
        answers: [
            { text: '09:20, 17:30', correct: true },
            { text: '09:00, 17:00', correct: false },
            { text: '09:30: 17:30', correct: false },
            { text: '09:00, 17:30', correct: false }
        ],
        translation: '8. What are the start and end times for Moducon 2025?'
    },
    {
        type: 'ox',
        question: '9. Track 00, 01, 10, i의 쉬는 시간은\n10:50 ~ 11:10, 11:50 ~ 12:00, 14:00 ~ 14:10,\n14:50 ~ 15:00, 15:40 ~ 15:50, 16:30 ~ 16:40으로\n배정 되어있다.',
        answer: true,
        translation: '9. The break times for Track 00, 01, 10, and i are scheduled as follows: 10:50 ~ 11:10, 11:50 ~ 12:00, 14:00 ~ 14:10, 14:50 ~ 15:00, 15:40 ~ 15:50, 16:30 ~ 16:40. (O/X)'
    },
    {
        type: 'short-answer',
        question: '10. Hands-on Workshop에서 어떤 세션들이 있을까요?',
        answer: '실습 워크숍',
        translation: '10. What sessions are available at the Hands-on Workshop?'
    },
];

startButton.addEventListener('click', startGame);
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});
restartButton.addEventListener('click', startGame);

function startGame() {
    score = 0;
    quizHeaderElement.classList.remove('hide');
    startButton.classList.add('hide');
    resultContainerElement.classList.add('hide');
    shuffledQuestions = questions.sort(() => Math.random() - .5);
    currentQuestionIndex = 0;
    questionContainerElement.classList.remove('hide');
    setNextQuestion();
}

function setNextQuestion() {
    resetState();
    if (currentQuestionIndex < shuffledQuestions.length) {
        showQuestion(shuffledQuestions[currentQuestionIndex]);
    } else {
        showResult();
    }
}

function showQuestion(question) {
    questionElement.innerText = question.question;

    const translationContainer = document.createElement('div');
    translationContainer.classList.add('translation-container', 'hide');
    translationContainer.innerText = question.translation;

    const translateButton = document.createElement('button');
    translateButton.innerText = 'Show EN';
    translateButton.classList.add('btn', 'translate-btn-small', 'translate-btn-header');
    translateButton.addEventListener('click', () => {
        translationContainer.classList.toggle('hide');
    });

    quizHeaderElement.appendChild(translateButton);
    questionElement.appendChild(translationContainer);

    if (question.type === 'multiple-choice') {
        renderMultipleChoice(question);
    } else if (question.type === 'drag-and-drop') {
        renderDragAndDrop(question);
    } else if (question.type === 'short-answer') {
        renderShortAnswer(question);
    } else if (question.type === 'ox') {
        renderOXQuiz(question);
    }
}

function renderOXQuiz(question) {
    answerButtonsElement.classList.add('ox-btn-grid');
    
    const buttonO = document.createElement('button');
    buttonO.innerText = 'O';
    buttonO.classList.add('btn');
    buttonO.dataset.correct = question.answer === true;
    buttonO.addEventListener('click', selectAnswer);
    answerButtonsElement.appendChild(buttonO);

    const buttonX = document.createElement('button');
    buttonX.innerText = 'X';
    buttonX.classList.add('btn');
    buttonX.dataset.correct = question.answer === false;
    buttonX.addEventListener('click', selectAnswer);
    answerButtonsElement.appendChild(buttonX);
}

function renderMultipleChoice(question) {
    answerButtonsElement.classList.add('btn-grid');
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function renderDragAndDrop(question) {
    answerButtonsElement.classList.add('dnd-grid');
    selectedImage = null; // Reset selection for the new question

    const targetsContainer = document.createElement('div');
    targetsContainer.classList.add('dnd-targets');
    
    const sourcesContainer = document.createElement('div');
    sourcesContainer.classList.add('dnd-sources');
    sourcesContainer.innerHTML = '<p>보기</p>';

    // --- Click Logic Functions ---
    const handleImageClick = (e) => {
        const clickedImage = e.currentTarget;
        
        // If nothing is selected, select the clicked image
        if (!selectedImage) {
            selectedImage = clickedImage;
            selectedImage.classList.add('selected');
        } 
        // If the clicked image is already selected, deselect it
        else if (selectedImage === clickedImage) {
            selectedImage.classList.remove('selected');
            selectedImage = null;
        } 
        // If another image is selected, swap selection
        else {
            selectedImage.classList.remove('selected');
            selectedImage = clickedImage;
            selectedImage.classList.add('selected');
        }
    };

    const handleDropZoneClick = (e) => {
        const dropZone = e.currentTarget;
        if (!selectedImage) return; // Nothing to drop

        const existingImage = dropZone.querySelector('.dnd-item');
        
        if (existingImage) {
            // If drop zone has an image, swap them
            const sourceOfSelected = selectedImage.parentElement;
            sourceOfSelected.appendChild(existingImage); // Move existing image to where the selected one was
        }
        
        dropZone.appendChild(selectedImage); // Move selected image to the drop zone
        selectedImage.classList.remove('selected');
        selectedImage = null;
    };
    
    sourcesContainer.addEventListener('click', (e) => {
        // Check if the click is on the container itself or its <p> tag
        if (e.target === sourcesContainer || e.target.tagName === 'P') {
            if (selectedImage) {
                sourcesContainer.appendChild(selectedImage);
                selectedImage.classList.remove('selected');
                selectedImage = null;
            }
        }
    });

    // --- Element Creation ---
    question.targets.forEach(target => {
        const targetEl = document.createElement('div');
        targetEl.classList.add('dnd-target');
        targetEl.dataset.targetId = target.id;
        
        const textEl = document.createElement('p');
        textEl.classList.add('dnd-target-text');
        textEl.innerText = target.text;
        
        const dropZone = document.createElement('div');
        dropZone.classList.add('dnd-drop-zone');
        dropZone.addEventListener('click', handleDropZoneClick);
        
        targetEl.appendChild(textEl);
        targetEl.appendChild(dropZone);
        targetsContainer.appendChild(targetEl);
    });

    const shuffledImages = [...question.images].sort(() => Math.random() - 0.5);
    shuffledImages.forEach(image => {
        const imgEl = document.createElement('img');
        imgEl.src = image.img;
        imgEl.classList.add('dnd-item');
        imgEl.dataset.imageId = image.id;
        imgEl.addEventListener('click', handleImageClick);
        sourcesContainer.appendChild(imgEl);
    });

    answerButtonsElement.appendChild(targetsContainer);
    answerButtonsElement.appendChild(sourcesContainer);

    const submitButton = document.createElement('button');
    submitButton.innerText = '확인';
    submitButton.classList.add('btn', 'submit-btn');
    submitButton.addEventListener('click', checkDragAndDrop);
    answerButtonsElement.appendChild(submitButton);
}

function renderShortAnswer(question) {
    answerButtonsElement.classList.add('short-answer-grid');
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'short-answer-input';
    input.placeholder = '답변을 입력하세요...';
    input.classList.add('short-answer-input');
    
    const submitButton = document.createElement('button');
    submitButton.innerText = '확인';
    submitButton.classList.add('btn', 'submit-btn');
    submitButton.addEventListener('click', () => checkShortAnswer(question, input));

    answerButtonsElement.appendChild(input);
    answerButtonsElement.appendChild(submitButton);
}

function checkShortAnswer(question, input) {
    const userAnswer = input.value.trim();
    const isCorrect = userAnswer.toLowerCase() === question.answer.toLowerCase();

    if (isCorrect) {
        score++;
        input.classList.add('correct');
    } else {
        input.classList.add('wrong');
    }

    input.disabled = true;
    document.querySelector('.submit-btn').disabled = true;

    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide');
    } else {
        setTimeout(showResult, 1000);
    }
}

function checkDragAndDrop() {
    let correctCount = 0;
    const targets = answerButtonsElement.querySelectorAll('.dnd-target');
    
    targets.forEach(target => {
        const targetId = target.dataset.targetId;
        const dropZone = target.querySelector('.dnd-drop-zone');
        const image = dropZone.querySelector('img');
        
        if (image) {
            const imageId = image.dataset.imageId;
            if (targetId === imageId) {
                target.classList.add('correct');
                correctCount++;
            } else {
                target.classList.add('wrong');
            }
        } else {
            target.classList.add('wrong');
        }
    });

    if (correctCount >= 3) {
        score++;
    }

    // Disable further interaction
    document.querySelector('.submit-btn').disabled = true;
    const allImages = document.querySelectorAll('.dnd-item');
    const allDropZones = document.querySelectorAll('.dnd-drop-zone');
    const sourcesContainer = document.querySelector('.dnd-sources');

    allImages.forEach(img => {
        // This is tricky because the handler is a closure. A simple way is to clone and replace.
        const newImg = img.cloneNode(true);
        img.parentNode.replaceChild(newImg, img);
    });
    allDropZones.forEach(zone => {
        const newZone = zone.cloneNode(true);
        zone.parentNode.replaceChild(newZone, zone);
    });
    const newSourcesContainer = sourcesContainer.cloneNode(true);
    sourcesContainer.parentNode.replaceChild(newSourcesContainer, sourcesContainer);


    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide');
    } else {
        setTimeout(showResult, 1500);
    }
}

function resetState() {
    clearStatusClass(document.body);
    nextButton.classList.add('hide');
    
    const existingTranslateBtn = quizHeaderElement.querySelector('.translate-btn-header');
    if (existingTranslateBtn) {
        quizHeaderElement.removeChild(existingTranslateBtn);
    }

    answerButtonsElement.className = '';
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';
    if (correct) {
        score++;
    }
    setStatusClass(selectedButton, correct);
    Array.from(answerButtonsElement.children).forEach(button => {
        if (button.dataset.correct === 'true') {
            setStatusClass(button, true);
        }
        button.disabled = true;
    });
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide');
    } else {
        setTimeout(showResult, 1000);
    }
}

function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

function showResult() {
    questionContainerElement.classList.add('hide');
    nextButton.classList.add('hide');
    resultContainerElement.classList.remove('hide');
    quizHeaderElement.classList.add('hide');
    scoreElement.innerText = score;
    document.getElementById('total-questions').innerText = shuffledQuestions.length;

    const resultMessage = document.getElementById('result-message');
    if (score >= 6) {
        resultMessage.innerText = '축하합니다! 컨퍼런스 퀴즈를 통과하셨습니다.';
        restartButton.classList.add('hide');
    } else {
        resultMessage.innerText = '아쉽지만, 퀴즈 통과에 실패하셨습니다.';
        restartButton.classList.remove('hide');
    }
}