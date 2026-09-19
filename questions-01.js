window.QUESTION_BANK = window.QUESTION_BANK || [];

function addQuestion(
 id,
 type,
 chapter,
 verse,
 level,
 question,
 answer,
 reference = null
) {
 window.QUESTION_BANK.push({
 id,
 type,
 chapter,
 verse,
 reference: reference || `John ${chapter}:${verse}`,
 level,
 question,
 answer
 });
}

/*
 JOHN 1
*/

addQuestion(
 "john-1-001",
 "INT",
 1,
 1,
 "w",
 "In the beginning was what?",
 "The Word."
);

addQuestion(
 "john-1-002",
 "INT",
 1,
 1,
 "w",
 "When was the Word?",
 "In the beginning."
);

addQuestion(
 "john-1-003",
 "INT",
 1,
 1,
 "w",
 "The Word was with whom?",
 "God."
);

addQuestion(
 "john-1-004",
 "Q",
 1,
 1,
 "w",
 "Quote John, chapter 1, verse 1.",
 "In the beginning was the Word, and the Word was with God, and the Word was God."
);

addQuestion(
 "john-1-005",
 "CVR",
 1,
 1,
 "u",
 "According to John, chapter 1, verse 1, who was with God?",
 "The Word was with God."
);

addQuestion(
 "john-1-006",
 "FTV",
 1,
 2,
 "w",
 "He was with God in ...",
 "...the beginning."
);

addQuestion(
 "john-1-007",
 "INT",
 1,
 2,
 "u",
 "He was with God when?",
 "In the beginning."
);

addQuestion(
 "john-1-008",
 "Q",
 1,
 2,
 "u",
 "Quote John, chapter 1, verse 2.",
 "He was with God in the beginning."
);

addQuestion(
 "john-1-009",
 "CVR",
 1,
 2,
 "u",
 "According to John, chapter 1, verse 2, he was what?",
 "With God in the beginning."
);

addQuestion(
 "john-1-010",
 "CR",
 1,
 3,
 "w",
 "According to John, chapter 1, without whom?",
 "Without him-the Word."
);

addQuestion(
 "john-1-011",
 "FTV",
 1,
 3,
 "w",
 "Through him all things were ...",
 "...made; without him nothing was made that has been made."
);

addQuestion(
 "john-1-012",
 "INT",
 1,
 3,
 "w",
 "All things were made how?",
 "Through him-the Word."
);

addQuestion(
 "john-1-013",
 "Q",
 1,
 3,
 "w",
 "Quote John, chapter 1, verse 3.",
 "Through him all things were made; without him nothing was made that has been made."
);

addQuestion(
 "john-1-014",
 "FTV",
 1,
 4,
 "w",
 "In him was life, and ...",
 "...that life was the light of all mankind."
);

addQuestion(
 "john-1-015",
 "INT",
 1,
 4,
 "u",
 "That life was what?",
 "The light of all mankind."
);

addQuestion(
 "john-1-016",
 "Q",
 1,
 4,
 "u",
 "Quote John, chapter 1, verse 4.",
 "In him was life, and that life was the light of all mankind."
);

addQuestion(
 "john-1-017",
 "CVR",
 1,
 4,
 "u",
 "According to John, chapter 1, verse 4, what light?",
 "The light of all mankind."
);

addQuestion(
 "john-1-018",
 "CR",
 1,
 5,
 "w",
 "According to John, chapter 1, overcome what?",
 "It-the darkness."
);

addQuestion(
 "john-1-019",
 "INT",
 1,
 5,
 "u",
 "The darkness has not what?",
 "Overcome it."
);

addQuestion(
 "john-1-020",
 "CVR",
 1,
 5,
 "u",
 "According to John, chapter 1, verse 5, overcome what?",
 "It-the light."
);

addQuestion(
 "john-1-021",
 "CVR",
 1,
 5,
 "u",
 "According to John, chapter 1, verse 5, the light what?",
 "The light shines in the darkness."
);

addQuestion(
 "john-1-022",
 "INT",
 1,
 6,
 "w",
 "There was a man sent from God whose name was what?",
 "John."
);

addQuestion(
 "john-1-023",
 "Q",
 1,
 6,
 "u",
 "Quote John, chapter 1, verse 6.",
 "There was a man sent from God whose name was John."
);

addQuestion(
 "john-1-024",
 "FTV",
 1,
 7,
 "u",
 "He came as a witness...",
 "...to testify concerning that light, so that through him all might believe."
);

addQuestion(
 "john-1-025",
 "INT",
 1,
 7,
 "u",
 "Who came as a witness to testify concerning that light?",
 "He-John."
);

addQuestion(
 "john-1-026",
 "INT",
 1,
 7,
 "u",
 "He came as a witness to testify concerning that light why?",
 "So that through him all might believe."
);

addQuestion(
 "john-1-027",
 "INT",
 1,
 7,
 "u",
 "Through him all might what?",
 "Believe."
);

addQuestion(
 "john-1-028",
 "Q",
 1,
 7,
 "u",
 "Quote John, chapter 1, verse 7.",
 "He came as a witness to testify concerning that light, so that through him all might believe."
);

addQuestion(
 "john-1-029",
 "CVR",
 1,
 7,
 "u",
 "According to John, chapter 1, verse 7, what witness?",
 "A witness to testify concerning that light."
);

addQuestion(
 "john-1-030",
 "CVR",
 1,
 7,
 "u",
 "According to John, chapter 1, verse 7, he came how?",
 "As a witness."
);

addQuestion(
 "john-1-031",
 "CVR",
 1,
 7,
 "u",
 "According to John, chapter 1, verse 7, through him what?",
 "All might believe."
);

addQuestion(
 "john-1-032",
 "INT",
 1,
 8,
 "w",
 "He came only as what?",
 "A witness to the light."
);

addQuestion(
 "john-1-033",
 "INT",
 1,
 8,
 "w",
 "He came only as a witness to what?",
 "Light."
);

addQuestion(
 "john-1-034",
 "CVR",
 1,
 8,
 "u",
 "According to John, chapter 1, verse 8, he came how?",
 "Only as a witness to the light."
);

addQuestion(
 "john-1-035",
 "CR",
 1,
 9,
 "w",
 "According to John, chapter 1, the true what?",
 "The true light that gives light to everyone."
);

addQuestion(
 "john-1-036",
 "INT",
 1,
 9,
 "u",
 "What was coming into the world?",
 "The true light that gives light to everyone."
);

addQuestion(
 "john-1-037",
 "INT",
 1,
 9,
 "u",
 "The true light that gives light to whom?",
 "Everyone."
);

addQuestion(
 "john-1-038",
 "Q",
 1,
 9,
 "u",
 "Quote John, chapter 1, verse 9.",
 "The true light that gives light to everyone was coming into the world."
);

addQuestion(
 "john-1-039",
 "Q2V",
 1,
 10,
 "v",
 "Quote John, chapter 1, verses 10 and 11.",
 "He was in the world, and though the world was made through him, the world did not recognize him. He came to that which was his own, but his own did not receive him.",
 "John 1:10-11"
);

addQuestion(
 "john-1-040",
 "CR",
 1,
 10,
 "w",
 "According to John, chapter 1, recognize whom?",
 "Him-the true light that gives light to everyone."
);

addQuestion(
 "john-1-041",
 "FTV",
 1,
 10,
 "u",
 "He was in the world ...",
 "...and though the world was made through him, the world did not recognize him."
);

addQuestion(
 "john-1-042",
 "INT",
 1,
 10,
 "u",
 "Who did not recognize him?",
 "The world."
);

addQuestion(
 "john-1-043",
 "INT",
 1,
 10,
 "u",
 "The world was made through whom?",
 "Him-the true light that gives light to everyone."
);

addQuestion(
 "john-1-044",
 "Q",
 1,
 10,
 "u",
 "Quote John, chapter 1, verse 10.",
 "He was in the world, and though the world was made through him, the world did not recognize him."
);

addQuestion(
 "john-1-045",
 "FTV",
 1,
 11,
 "u",
 "He came to that which ...",
 "...was his own, but his own did not receive him."
);

addQuestion(
 "john-1-046",
 "INT",
 1,
 11,
 "u",
 "Who did not receive him?",
 "His own."
);

addQuestion(
 "john-1-047",
 "INT",
 1,
 11,
 "u",
 "He came to that which was what?",
 "His own."
);

addQuestion(
 "john-1-048",
 "Q",
 1,
 11,
 "u",
 "Quote John, chapter 1, verse 11.",
 "He came to that which was his own, but his own did not receive him."
);

addQuestion(
 "john-1-049",
 "CVR",
 1,
 11,
 "u",
 "According to John, chapter 1, verse 11, he came where?",
 "He came to that which was his own."
);

addQuestion(
 "john-1-050",
 "F2V",
 1,
 12,
 "u",
 "Yet to all who did ...",
 "...receive him, to those who believed in his name, he gave the right to become children of God-children born not of natural descent, nor of human decision or a husband's will, but born of God.",
 "John 1:12-13"
);

addQuestion(
 "john-1-051",
 "CR",
 1,
 12,
 "u",
 "According to John, chapter 1, believed in what?",
 "His name."
);

addQuestion(
 "john-1-052",
 "CR",
 1,
 12,
 "u",
 "According to John, chapter 1, children of whom?",
 "God."
);

addQuestion(
 "john-1-053",
 "FTV",
 1,
 12,
 "u",
 "Yet to all who did ...",
 "...receive him, to those who believed in his name, he gave the right to become children of God."
);

addQuestion(
 "john-1-054",
 "INT",
 1,
 12,
 "u",
 "He gave the right to what?",
 "Become children of God."
);

addQuestion(
 "john-1-055",
 "INT",
 1,
 12,
 "u",
 "The right to become children of whom?",
 "God."
);

addQuestion(
 "john-1-056",
 "MA",
 1,
 12,
 "u",
 "Yet to all who what?",
 "Receive him; believe in his name."
);

addQuestion(
 "john-1-057",
 "Q",
 1,
 12,
 "u",
 "Quote John, chapter 1, verse 12.",
 "Yet to all who did receive him, to those who believed in his name, he gave the right to become children of God."
);

addQuestion(
 "john-1-058",
 "CVR",
 1,
 12,
 "u",
 "According to John, chapter 1, verse 12, what children?",
 "Children of God."
);

addQuestion(
 "john-1-059",
 "CRMA",
 1,
 13,
 "v",
 "According to John, chapter 1, born how?",
 "Not of natural descent, nor of human decision or a husband's will, but born of God."
);

addQuestion(
 "john-1-060",
 "CR",
 1,
 13,
 "u",
 "According to John, chapter 1, born of whom?",
 "God."
);

addQuestion(
 "john-1-061",
 "INT",
 1,
 13,
 "u",
 "What decision?",
 "Human."
);

addQuestion(
 "john-1-062",
 "INT",
 1,
 13,
 "u",
 "What descent?",
 "Natural."
);

addQuestion(
 "john-1-063",
 "MA",
 1,
 13,
 "u",
 "Children born how?",
 "Not of natural descent, nor of human decision or a husband's will, but born of God."
);

addQuestion(
 "john-1-064",
 "Q",
 1,
 13,
 "u",
 "Quote John, chapter 1, verse 13.",
 "Children born not of natural descent, nor of human decision or a husband's will, but born of God."
);

addQuestion(
 "john-1-065",
 "CVRMA",
 1,
 14,
 "v",
 "According to John, chapter 1, verse 14, the Word what?",
 "The Word became flesh and made his dwelling among us."
);

addQuestion(
 "john-1-066",
 "CR",
 1,
 14,
 "w",
 "According to John, chapter 1, we have seen what?",
 "We have seen his glory, the glory of the one and only Son."
);

addQuestion(
 "john-1-067",
 "CR",
 1,
 14,
 "w",
 "According to John, chapter 1, the glory of whom?",
 "The one and only Son."
);

addQuestion(
 "john-1-068",
 "FTV",
 1,
 14,
 "u",
 "The Word became flesh and ...",
 "...made his dwelling among us. We have seen his glory, the glory of the one and only Son, who came from the Father, full of grace and truth."
);

addQuestion(
 "john-1-069",
 "INT",
 1,
 14,
 "u",
 "Full of grace and what?",
 "Truth."
);

addQuestion(
 "john-1-070",
 "INT",
 1,
 14,
 "u",
 "Who made his dwelling among us?",
 "The Word."
);

addQuestion(
 "john-1-071",
 "Q",
 1,
 14,
 "u",
 "Quote John, chapter 1, verse 14.",
 "The Word became flesh and made his dwelling among us. We have seen his glory, the glory of the one and only Son, who came from the Father, full of grace and truth."
);

addQuestion(
 "john-1-072",
 "CVR",
 1,
 14,
 "u",
 "According to John, chapter 1, verse 14, made what?",
 "Made his dwelling."
);

addQuestion(
 "john-1-073",
 "CR",
 1,
 15,
 "w",
 "According to John, chapter 1, who spoke?",
 "I-John."
);

addQuestion(
 "john-1-074",
 "CR",
 1,
 15,
 "w",
 "According to John, chapter 1, who testified?",
 "John."
);

addQuestion(
 "john-1-075",
 "INT",
 1,
 15,
 "u",
 "Who testified concerning him?",
 "John."
);

addQuestion(
 "john-1-076",
 "CVR",
 1,
 15,
 "u",
 "According to John, chapter 1, verse 15, who has surpassed me?",
 "He who comes after me has surpassed me."
);

addQuestion(
 "john-1-077",
 "SIT",
 1,
 15,
 "v",
 "Who said, \"He who comes after me has surpassed me because he was before me\"?",
 "John."
);

addQuestion(
 "john-1-078",
 "INT",
 1,
 16,
 "u",
 "Grace in place of what?",
 "Grace already given."
);

addQuestion(
 "john-1-079",
 "INT",
 1,
 16,
 "u",
 "We have all received grace in place of what?",
 "Grace already given."
);

addQuestion(
 "john-1-080",
 "Q",
 1,
 16,
 "u",
 "Quote John, chapter 1, verse 16.",
 "Out of his fullness we have all received grace in place of grace already given."
);

addQuestion(
 "john-1-081",
 "FTV",
 1,
 17,
 "u",
 "For the law was given ...",
 "...through Moses; grace and truth came through Jesus Christ."
);

addQuestion(
 "john-1-082",
 "INT",
 1,
 17,
 "u",
 "What was given through Moses?",
 "The law."
);

addQuestion(
 "john-1-083",
 "MA",
 1,
 17,
 "u",
 "What came through Jesus Christ?",
 "Grace and truth."
);

addQuestion(
 "john-1-084",
 "CVR",
 1,
 17,
 "u",
 "According to John, chapter 1, verse 17, given how?",
 "Through Moses."
);

addQuestion(
 "john-1-085",
 "INT",
 1,
 18,
 "w",
 "Closest what?",
 "Relationship with the Father."
);

addQuestion(
 "john-1-086",
 "INT",
 1,
 18,
 "u",
 "Who has ever seen God?",
 "No one."
);

addQuestion(
 "john-1-087",
 "INT",
 1,
 18,
 "u",
 "Who is in closest relationship with the Father?",
 "The one and only Son."
);

addQuestion(
 "john-1-088",
 "Q",
 1,
 18,
 "u",
 "Quote John, chapter 1, verse 18.",
 "No one has ever seen God, but the one and only Son, who is himself God and is in closest relationship with the Father, has made him known."
);

addQuestion(
 "john-1-089",
 "CVR",
 1,
 18,
 "u",
 "According to John, chapter 1, verse 18, the one and only Son, who what?",
 "Who is himself God."
);

addQuestion(
 "john-1-090",
 "Q2V",
 1,
 19,
 "v",
 "Quote John, chapter 1, verses 19 and 20.",
 "Now this was John's testimony when the Jewish leaders in Jerusalem sent priests and Levites to ask him who he was. He did not fail to confess, but confessed freely, \"I am not the Messiah.\"",
 "John 1:19-20"
);

addQuestion(
 "john-1-091",
 "CVRMA",
 1,
 19,
 "v",
 "According to John, chapter 1, verse 19, sent whom?",
 "Priests and Levites."
);

addQuestion(
 "john-1-092",
 "CR",
 1,
 19,
 "u",
 "According to John, chapter 1, John's what?",
 "Testimony."
);

addQuestion(
 "john-1-093",
 "CR",
 1,
 19,
 "u",
 "According to John, chapter 1, to ask him what?",
 "To ask him who he was."
);

addQuestion(
 "john-1-094",
 "INT",
 1,
 19,
 "u",
 "The Jewish leaders where?",
 "In Jerusalem."
);

addQuestion(
 "john-1-095",
 "INT",
 1,
 19,
 "u",
 "This was John's testimony when?",
 "When the Jewish leaders in Jerusalem sent priests and Levites to ask him who he was."
);

addQuestion(
 "john-1-096",
 "MA",
 1,
 19,
 "u",
 "The Jewish leaders in Jerusalem sent whom?",
 "Priests and Levites."
);

addQuestion(
 "john-1-097",
 "CVR",
 1,
 19,
 "u",
 "According to John, chapter 1, verse 19, whose testimony?",
 "John's testimony."
);

addQuestion(
 "john-1-098",
 "INT",
 1,
 20,
 "u",
 "He did not fail to confess, but what?",
 "Confessed freely, \"I am not the Messiah.\""
);

addQuestion(
 "john-1-099",
 "INT",
 1,
 20,
 "u",
 "He did not fail to what?",
 "Confess."
);

addQuestion(
 "john-1-100",
 "CR",
 1,
 22,
 "u",
 "According to John, chapter 1, give us what?",
 "An answer to take back to those who sent us."
);

addQuestion(
 "john-1-101",
 "CR",
 1,
 22,
 "u",
 "According to John, chapter 1, what answer?",
 "An answer to take back to those who sent us."
);

addQuestion(
 "john-1-102",
 "CVR",
 1,
 22,
 "u",
 "According to John, chapter 1, verse 22, those who what?",
 "Those who sent us."
);

addQuestion(
 "john-1-103",
 "FTV",
 1,
 23,
 "w",
 "I am the voice of ...",
 "...one calling in the wilderness, 'Make straight the way for the Lord.'"
);

addQuestion(
 "john-1-104",
 "CR",
 1,
 23,
 "u",
 "According to John, chapter 1, the words of whom?",
 "Isaiah the prophet."
);

addQuestion(
 "john-1-105",
 "CR",
 1,
 23,
 "u",
 "According to John, chapter 1, calling where?",
 "Calling in the wilderness."
);

addQuestion(
 "john-1-106",
 "FTV",
 1,
 23,
 "u",
 "John replied in the words...",
 "...of Isaiah the prophet, \"I am the voice of one calling in the wilderness, 'Make straight the way for the Lord.'\""
);

addQuestion(
 "john-1-107",
 "INT",
 1,
 23,
 "u",
 "I am the voice of whom?",
 "One calling in the wilderness."
);

addQuestion(
 "john-1-108",
 "Q",
 1,
 23,
 "u",
 "Quote John, chapter 1, verse 23.",
 "John replied in the words of Isaiah the prophet, \"I am the voice of one calling in the wilderness, 'Make straight the way for the Lord.'\""
);

addQuestion(
 "john-1-109",
 "CVR",
 1,
 23,
 "u",
 "According to John, chapter 1, verse 23, \"I am what?",
 "The voice of one calling in the wilderness."
);

addQuestion(
 "john-1-110",
 "INT",
 1,
 27,
 "u",
 "Not worthy to what?",
 "Untie."
);

addQuestion(
 "john-1-111",
 "CVR",
 1,
 27,
 "u",
 "According to John, chapter 1, verse 27, I am not what?",
 "Worthy to untie."
);

addQuestion(
 "john-1-112",
 "CR",
 1,
 29,
 "u",
 "According to John, chapter 1, what sin?",
 "The sin of the world."
);

addQuestion(
 "john-1-113",
 "FTV",
 1,
 29,
 "u",
 "The next day John saw ...",
 "...Jesus coming toward him and said, \"Look, the Lamb of God, who takes away the sin of the world.\""
);

addQuestion(
 "john-1-114",
 "INT",
 1,
 29,
 "u",
 "John saw Jesus coming where?",
 "Toward him."
);

addQuestion(
 "john-1-115",
 "CVR",
 1,
 29,
 "u",
 "According to John, chapter 1, verse 29, what Lamb?",
 "The Lamb of God."
);

addQuestion(
 "john-1-116",
 "FTV",
 1,
 30,
 "u",
 "This is the one I ...",
 "...meant when I said, 'A man who comes after me has surpassed me because he was before me.'"
);

addQuestion(
 "john-1-117",
 "Q",
 1,
 30,
 "u",
 "Quote John, chapter 1, verse 30.",
 "This is the one I meant when I said, 'A man who comes after me has surpassed me because he was before me.'"
);

addQuestion(
 "john-1-118",
 "CVR",
 1,
 30,
 "u",
 "According to John, chapter 1, verse 30, who has surpassed me?",
 "A man who comes after me has surpassed me."
);

addQuestion(
 "john-1-119",
 "INT",
 1,
 31,
 "u",
 "Baptizing with what?",
 "Water."
);

addQuestion(
 "john-1-120",
 "INT",
 1,
 31,
 "u",
 "I came baptizing with water why?",
 "That he might be revealed to Israel."
);

addQuestion(
 "john-1-121",
 "INT",
 1,
 31,
 "u",
 "He might be revealed to whom?",
 "Israel."
);

addQuestion(
 "john-1-122",
 "CVRMA",
 1,
 32,
 "u",
 "According to John, chapter 1, verse 32, \"I saw what?",
 "The Spirit come down from heaven as a dove and remain on him."
);

addQuestion(
 "john-1-123",
 "INT",
 1,
 32,
 "u",
 "I saw the Spirit come down from heaven as what?",
 "A dove."
);

addQuestion(
 "john-1-124",
 "CVR",
 1,
 32,
 "u",
 "According to John, chapter 1, verse 32, \"I saw what?",
 "I saw the Spirit come down from heaven as a dove and remain on him."
);

addQuestion(
 "john-1-125",
 "FTV",
 1,
 33,
 "u",
 "And I myself did not ...",
 "...know him, but the one who sent me to baptize with water told me, 'The man on whom you see the Spirit come down and remain is the one who will baptize with the Holy Spirit.'"
);

addQuestion(
 "john-1-126",
 "INT",
 1,
 33,
 "u",
 "Who will baptize with the Holy Spirit?",
 "The man on whom you see the Spirit come down and remain."
);

addQuestion(
 "john-1-127",
 "CR",
 1,
 34,
 "u",
 "According to John, chapter 1, I testify what?",
 "I testify that this is God's Chosen One."
);

addQuestion(
 "john-1-128",
 "INT",
 1,
 34,
 "u",
 "I have seen and I testify that what?",
 "This is God's Chosen One."
);

addQuestion(
 "john-1-129",
 "INT",
 1,
 35,
 "u",
 "John was there again with whom?",
 "Two of his disciples."
);

addQuestion(
 "john-1-130",
 "MA",
 1,
 35,
 "u",
 "Who was there again?",
 "John, with two of his disciples."
);

addQuestion(
 "john-1-131",
 "CVR",
 1,
 35,
 "u",
 "According to John, chapter 1, verse 35, the next day what?",
 "John was there again with two of his disciples."
);

addQuestion(
 "john-1-132",
 "FTV",
 1,
 36,
 "u",
 "When he saw Jesus passing ...",
 "...by, he said, \"Look, the Lamb of God!\""
);

addQuestion(
 "john-1-133",
 "INT",
 1,
 36,
 "u",
 "When he saw Jesus passing by, he said what?",
 "\"Look, the Lamb of God!\""
);

addQuestion(
 "john-1-134",
 "Q",
 1,
 36,
 "u",
 "Quote John, chapter 1, verse 36.",
 "When he saw Jesus passing by, he said, \"Look, the Lamb of God!\""
);

addQuestion(
 "john-1-135",
 "CR",
 1,
 37,
 "u",
 "According to John, chapter 1, they followed whom?",
 "Jesus."
);

addQuestion(
 "john-1-136",
 "INT",
 1,
 37,
 "u",
 "They followed Jesus when?",
 "When the two disciples heard him say this."
);

addQuestion(
 "john-1-137",
 "CR",
 1,
 38,
 "u",
 'According to John, chapter 1, what means "Teacher"?',
 "Rabbi."
);

addQuestion(
 "john-1-138",
 "INT",
 1,
 38,
 "u",
 "Who saw them following?",
 "Jesus."
);

addQuestion(
 "john-1-139",
 "CVR",
 1,
 38,
 "u",
 "According to John, chapter 1, verse 38, Jesus saw what?",
 "Jesus saw them following."
);

addQuestion(
 "john-1-140",
 "INT",
 1,
 39,
 "u",
 "So they went and saw what?",
 "Where he was staying."
);

addQuestion(
 "john-1-141",
 "INT",
 1,
 39,
 "u",
 "They went and saw where he was what?",
 "Staying."
);

addQuestion(
 "john-1-142",
 "MA",
 1,
 39,
 "u",
 "So they went and what?",
 "Saw where he was staying, and they spent that day with him."
);

addQuestion(
 "john-1-143",
 "INT",
 1,
 40,
 "u",
 "Who had followed Jesus?",
 "Andrew, Simon Peter's brother."
);

addQuestion(
 "john-1-144",
 "CR",
 1,
 41,
 "u",
 "According to John, chapter 1, the first what?",
 "The first thing Andrew did."
);

addQuestion(
 "john-1-145",
 "INT",
 1,
 41,
 "u",
 "The first thing Andrew did was to find whom?",
 "His brother Simon."
);

addQuestion(
 "john-1-146",
 "INT",
 1,
 41,
 "u",
 "\"We have found the Messiah\"-that is whom?",
 "The Christ."
);

addQuestion(
 "john-1-147",
 "MA",
 1,
 41,
 "u",
 "The first thing Andrew did was to what?",
 "Find his brother Simon and tell him, \"We have found the Messiah.\""
);

addQuestion(
 "john-1-148",
 "CVR",
 1,
 41,
 "u",
 "\"We have found whom?\"",
 "The Messiah-that is, the Christ."
);

addQuestion(
 "john-1-149",
 "INT",
 1,
 42,
 "u",
 "Jesus looked at whom?",
 "Him-Simon."
);

addQuestion(
 "john-1-150",
 "INT",
 1,
 42,
 "u",
 "\"You are Simon son of whom?\"",
 "John."
);

addQuestion(
 "john-1-151",
 "CVR",
 1,
 42,
 "u",
 "According to John, chapter 1, verse 42, called what?",
 "Called Cephas."
);

addQuestion(
 "john-1-152",
 "SIT",
 1,
 42,
 "u",
 "Who said, \"You are Simon son of John. You will be called Cephas\"?",
 "Jesus looked at him and said."
);

addQuestion(
 "john-1-153",
 "INT",
 1,
 43,
 "u",
 "Finding Philip, he said to him what?",
 "Follow me."
);

addQuestion(
 "john-1-154",
 "CR",
 1,
 44,
 "u",
 "According to John, chapter 1, what town?",
 "The town of Bethsaida."
);

addQuestion(
 "john-1-155",
 "INT",
 1,
 44,
 "u",
 "Philip, like Andrew and Peter, was what?",
 "From the town of Bethsaida."
);

addQuestion(
 "john-1-156",
 "INT",
 1,
 44,
 "u",
 "Who was from the town of Bethsaida?",
 "Philip, like Andrew and Peter."
);

addQuestion(
 "john-1-157",
 "FTV",
 1,
 45,
 "u",
 "Philip found Nathanael and told ...",
 "...him, \"We have found the one Moses wrote about in the Law, and about whom the prophets also wrote-Jesus of Nazareth, the son of Joseph.\""
);

addQuestion(
 "john-1-158",
 "INT",
 1,
 45,
 "u",
 "About whom did the prophets also what?",
 "Wrote."
);

addQuestion(
 "john-1-159",
 "INT",
 1,
 45,
 "u",
 "\"We have found the one Moses wrote about where?\"",
 "In the Law."
);

addQuestion(
 "john-1-160",
 "Q",
 1,
 45,
 "u",
 "Quote John, chapter 1, verse 45.",
 "Philip found Nathanael and told him, \"We have found the one Moses wrote about in the Law, and about whom the prophets also wrote-Jesus of Nazareth, the son of Joseph.\""
);

addQuestion(
 "john-1-161",
 "INT",
 1,
 47,
 "u",
 "Here truly is whom?",
 "An Israelite in whom there is no deceit."
);

addQuestion(
 "john-1-162",
 "INT",
 1,
 47,
 "u",
 "An Israelite in whom there is no what?",
 "Deceit."
);

addQuestion(
 "john-1-163",
 "INT",
 1,
 47,
 "u",
 "Who saw Nathanael approaching?",
 "Jesus."
);

addQuestion(
 "john-1-164",
 "INT",
 1,
 47,
 "u",
 "Jesus saw Nathanael what?",
 "Approaching."
);

addQuestion(
 "john-1-165",
 "CVR",
 1,
 48,
 "u",
 "According to John, chapter 1, verse 48, \"I saw you when?\"",
 "While you were still under the fig tree before Philip called you."
);

addQuestion(
 "john-1-166",
 "SIT",
 1,
 48,
 "u",
 "Who said, \"I saw you while you were still under the fig tree before Philip called you\"?",
 "Jesus answered."
);

addQuestion(
 "john-1-167",
 "CVRMA",
 1,
 49,
 "u",
 "According to John, chapter 1, verse 49, you are whom?",
 "The Son of God; you are the king of Israel."
);

addQuestion(
 "john-1-168",
 "CR",
 1,
 49,
 "u",
 "According to John, chapter 1, the king of what?",
 "The king of Israel."
);

addQuestion(
 "john-1-169",
 "FTV",
 1,
 49,
 "u",
 "Then Nathanael declared, \"Rabbi, you ...",
 "...are the Son of God; you are the king of Israel.\""
);

addQuestion(
 "john-1-170",
 "INT",
 1,
 49,
 "u",
 "You are the king of what?",
 "Israel."
);

addQuestion(
 "john-1-171",
 "MA",
 1,
 49,
 "u",
 "Rabbi, you are whom?",
 "The Son of God; the king of Israel."
);

addQuestion(
 "john-1-172",
 "Q",
 1,
 49,
 "u",
 "Quote John, chapter 1, verse 49.",
 "Then Nathanael declared, \"Rabbi, you are the Son of God; you are the king of Israel.\""
);

addQuestion(
 "john-1-173",
 "SIT",
 1,
 49,
 "u",
 "Who said, \"Rabbi, you are the Son of God; you are the king of Israel\"?",
 "Then Nathanael declared."
);

addQuestion(
 "john-1-174",
 "CR",
 1,
 50,
 "u",
 "According to John, chapter 1, greater what?",
 "Greater things than that."
);

addQuestion(
 "john-1-175",
 "CVR",
 1,
 50,
 "u",
 "According to John, chapter 1, verse 50, you will see what?",
 "Greater things than that."
);

addQuestion(
 "john-1-176",
 "CVRMA",
 1,
 51,
 "u",
 "According to John, chapter 1, verse 51, you will see what?",
 "Heaven open, and the angels of God ascending and descending on the Son of Man."
);

addQuestion(
 "john-1-177",
 "CR",
 1,
 51,
 "u",
 "According to John, chapter 1, what angels?",
 "The angels of God."
);

addQuestion(
 "john-1-178",
 "FTV",
 1,
 51,
 "u",
 "He then added, \"Very truly ...",
 "...I tell you, you will see heaven open, and the angels of God ascending and descending on the Son of Man.\""
);

addQuestion(
 "john-1-179",
 "INT",
 1,
 51,
 "u",
 "The angels of whom?",
 "God."
);

addQuestion(
 "john-1-180",
 "INT",
 1,
 51,
 "u",
 "The angels of God ascending and descending on whom?",
 "The Son of Man."
);

addQuestion(
 "john-1-181",
 "Q",
 1,
 51,
 "u",
 "Quote John, chapter 1, verse 51.",
 "He then added, \"Very truly I tell you, you will see heaven open, and the angels of God ascending and descending on the Son of Man.\""
);

addQuestion(
 "john-1-182",
 "SIT",
 1,
 51,
 "u",
 "Who said, \"Very truly I tell you, you will see heaven open, and the angels of God ascending and descending on the Son of Man\"?",
 "He-Jesus-then added."
);

console.log(
 `Loaded ${window.QUESTION_BANK.length} questions from John 1.`
);