const QUESTION_DATA = [
  {
    "kor": "AI는 혁신입니다.",
    "eng": "AI is an innovation",
    "words": ["AI", "is", "an", "innovation"]
  },
  {
    "kor": "나는 자바스크립트를 배우고 있다.",
    "eng": "i am learning javascript",
    "words": ["i", "am", "learning", "javascript"]
  },
  {
    "kor": "이 게임은 재미있다.",
    "eng": "this game is fun",
    "words": ["this", "game", "is", "fun"]
  },
  {
    "kor": "나는 매일 아침 커피를 마신다.",
    "eng": "i drink coffee every morning",
    "words": ["i", "drink", "coffee", "every", "morning"]
  },
  {
    "kor": "그녀는 책 읽는 것을 좋아한다.",
    "eng": "she likes reading books",
    "words": ["she", "likes", "reading", "books"]
  },
  {
    "kor": "우리는 지금 집에 가는 중이다.",
    "eng": "we are going home now",
    "words": ["we", "are", "going", "home", "now"]
  },
  {
    "kor": "코딩은 매우 흥미롭다.",
    "eng": "coding is very interesting",
    "words": ["coding", "is", "very", "interesting"]
  },
  {
    "kor": "이메일을 확인해 주세요.",
    "eng": "please check your email",
    "words": ["please", "check", "your", "email"]
  },
  {
    "kor": "오늘 서버가 다운되었다.",
    "eng": "the server is down today",
    "words": ["the", "server", "is", "down", "today"]
  },
  {
    "kor": "나는 나만의 앱을 만들고 싶다.",
    "eng": "i want to build apps",
    "words": ["i", "want", "to", "build", "apps"]
  },
  {
    "kor": "나를 좀 도와줄 수 있니?",
    "eng": "can you help me please",
    "words": ["can", "you", "help", "me", "please"]
  },
  {
    "kor": "날씨가 정말 좋다.",
    "eng": "the weather is really nice",
    "words": ["the", "weather", "is", "really", "nice"]
  },
  {
    "kor": "버스 정류장이 어디인가요?",
    "eng": "where is the bus stop",
    "words": ["where", "is", "the", "bus", "stop"]
  },
  {
    "kor": "그는 열심히 공부하고 있다.",
    "eng": "he is studying hard",
    "words": ["he", "is", "studying", "hard"]
  },
  {
    "kor": "이것은 내가 가장 좋아하는 노래다.",
    "eng": "this is my favorite song",
    "words": ["this", "is", "my", "favorite", "song"]
  },
  {
    "kor": "우리는 저녁을 요리해야 한다.",
    "eng": "we need to cook dinner",
    "words": ["we", "need", "to", "cook", "dinner"]
  },
  {
    "kor": "내일 만날 수 있을까?",
    "eng": "can we meet tomorrow",
    "words": ["can", "we", "meet", "tomorrow"]
  },
  {
    "kor": "그 고양이는 매우 귀엽다.",
    "eng": "the cat is very cute",
    "words": ["the", "cat", "is", "very", "cute"]
  },
  {
    "kor": "나는 새 노트북을 샀다.",
    "eng": "i bought a new laptop",
    "words": ["i", "bought", "a", "new", "laptop"]
  },
  {
    "kor": "비밀번호를 잊어버리지 마세요.",
    "eng": "do not forget your password",
    "words": ["do", "not", "forget", "your", "password"]
  },
  {
    "kor": "시간이 너무 빨리 간다.",
    "eng": "time goes so fast",
    "words": ["time", "goes", "so", "fast"]
  },
  {
    "kor": "나는 축구하는 것을 즐긴다.",
    "eng": "i enjoy playing soccer",
    "words": ["i", "enjoy", "playing", "soccer"]
  },
  {
    "kor": "그녀는 좋은 친구이다.",
    "eng": "she is a good friend",
    "words": ["she", "is", "a", "good", "friend"]
  },
  {
    "kor": "데이터베이스 연결이 실패했다.",
    "eng": "database connection has failed",
    "words": ["database", "connection", "has", "failed"]
  },
  {
    "kor": "그들은 공원에 있다.",
    "eng": "they are in the park",
    "words": ["they", "are", "in", "the", "park"]
  },
  {
    "kor": "나는 음악 듣는 것을 사랑한다.",
    "eng": "i love listening to music",
    "words": ["i", "love", "listening", "to", "music"]
  },
  {
    "kor": "이 문제는 너무 어렵다.",
    "eng": "this problem is too hard",
    "words": ["this", "problem", "is", "too", "hard"]
  },
  {
    "kor": "파일을 저장해 주세요.",
    "eng": "please save the file",
    "words": ["please", "save", "the", "file"]
  },
  {
    "kor": "나는 늦게 일어났다.",
    "eng": "i woke up late",
    "words": ["i", "woke", "up", "late"]
  },
  {
    "kor": "너는 할 수 있다.",
    "eng": "you can do it",
    "words": ["you", "can", "do", "it"]
  },
  {
    "kor": "그 영화는 정말 슬펐다.",
    "eng": "the movie was so sad",
    "words": ["the", "movie", "was", "so", "sad"]
  },
  {
    "kor": "나는 영어를 배우고 싶다.",
    "eng": "i want to learn english",
    "words": ["i", "want", "to", "learn", "english"]
  },
  {
    "kor": "창문을 열어도 될까요?",
    "eng": "can i open the window",
    "words": ["can", "i", "open", "the", "window"]
  },
  {
    "kor": "그것은 좋은 생각이다.",
    "eng": "that is a good idea",
    "words": ["that", "is", "a", "good", "idea"]
  },
  {
    "kor": "우리 산책하러 가자.",
    "eng": "let us go for a walk",
    "words": ["let", "us", "go", "for", "a", "walk"]
  },
  {
    "kor": "내 전화기가 작동하지 않는다.",
    "eng": "my phone is not working",
    "words": ["my", "phone", "is", "not", "working"]
  },
  {
    "kor": "그는 서울에 산다.",
    "eng": "he lives in seoul",
    "words": ["he", "lives", "in", "seoul"]
  },
  {
    "kor": "나는 피자가 먹고 싶다.",
    "eng": "i want to eat pizza",
    "words": ["i", "want", "to", "eat", "pizza"]
  },
  {
    "kor": "이 방은 너무 덥다.",
    "eng": "this room is too hot",
    "words": ["this", "room", "is", "too", "hot"]
  },
  {
    "kor": "나는 여름을 기다린다.",
    "eng": "i am waiting for summer",
    "words": ["i", "am", "waiting", "for", "summer"]
  },
  {
    "kor": "그녀는 피아노를 칠 수 있다.",
    "eng": "she can play the piano",
    "words": ["she", "can", "play", "the", "piano"]
  },
  {
    "kor": "우리는 프로젝트를 끝냈다.",
    "eng": "we finished the project",
    "words": ["we", "finished", "the", "project"]
  },
  {
    "kor": "하늘이 파란색이다.",
    "eng": "the sky is blue",
    "words": ["the", "sky", "is", "blue"]
  },
  {
    "kor": "나는 여행을 가고 싶다.",
    "eng": "i want to go travel",
    "words": ["i", "want", "to", "go", "travel"]
  },
  {
    "kor": "그는 선생님이 되었다.",
    "eng": "he became a teacher",
    "words": ["he", "became", "a", "teacher"]
  },
  {
    "kor": "이것은 매우 중요한 일이다.",
    "eng": "this is very important work",
    "words": ["this", "is", "very", "important", "work"]
  },
  {
    "kor": "물 좀 주시겠어요?",
    "eng": "can i have some water",
    "words": ["can", "i", "have", "some", "water"]
  },
  {
    "kor": "나는 지금 행복하다.",
    "eng": "i am happy right now",
    "words": ["i", "am", "happy", "right", "now"]
  },
  {
    "kor": "그녀는 예쁜 드레스를 입었다.",
    "eng": "she wore a pretty dress",
    "words": ["she", "wore", "a", "pretty", "dress"]
  },
  {
    "kor": "우리는 더 많은 데이터가 필요하다.",
    "eng": "we need more data",
    "words": ["we", "need", "more", "data"]
  },
  {
    "kor": "이 자리에 앉아도 되나요?",
    "eng": "can i sit here",
    "words": ["can", "i", "sit", "here"]
  },
  {
    "kor": "나는 그를 이해한다.",
    "eng": "i understand him",
    "words": ["i", "understand", "him"]
  },
  {
    "kor": "오늘은 금요일이다.",
    "eng": "today is friday",
    "words": ["today", "is", "friday"]
  }
];