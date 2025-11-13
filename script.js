//for synonyms create reusable function
const createSynonym = (arr) =>
{
    const synonymContainer = arr.map((el) => `<span class ="btn">${el}</span>`);
    return (synonymContainer.join(" "));
};

const manageSpinner = (status) =>
{
    if(status === true)
    {
        document.getElementById('spinner').classList.remove('hidden');
        document.getElementById('word-container').classList.add('hidden');
    }
    else
    {
        document.getElementById('word-container').classList.remove('hidden');
        document.getElementById('spinner').classList.add('hidden');
    }
}

const loadLessons = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all') //promise for response
        .then(res => res.json()) //promise for json data
        .then(json => displayLessons(json.data));
};

const removeActive =() =>
{
    const lessonButtons =document.querySelectorAll(".lesson-btn");
    // console.log(lessonButtons);
    lessonButtons.forEach(btn => btn.classList.remove('btn-active'));
}

const loadLevelWord = id => {
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then(res => res.json())
        .then(data => 
            {   removeActive(); //remove active class from all buttons
                const clickBtn =document.getElementById(`lesson-btn-${id}`);
                // console.log(clickBtn);
                clickBtn.classList.add('btn-active'); //ad active class to the clicked button
                displayLevelWord(data.data)
});
}

const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    // console.log(url);
    const res = await fetch(url); //promise for response
    const details = await res.json(); //promise for json data
    displayWordDetails(details.data);

}

// {
//     "word": "Hesitate",
//     "meaning": "দ্বিধা করা",
//     "pronunciation": "হেজিটেট",
//     "level": 2,
//     "sentence": "Don't hesitate to ask questions in class.",
//     "points": 2,
//     "partsOfSpeech": "verb",
//     "synonyms": [
//         "pause",
//         "waver",
//         "doubt"
//     ],
//     "id": 8
// }

const displayWordDetails = (word) => 
{
    console.log(word);
    const detailsBox =document.getElementById('details-container');
    detailsBox.innerHTML=`
    <div class="">
        <h2 class="text-2xl font-bold">${word.word} ( <i class="fa-solid fa-microphone-lines"></i> : ${word.pronunciation} )</h2>
      </div>

       <div class="">
        <h2 class="text-2xl font-bold">Meaning</h2>
        <p>${word.meaning}</p>
      </div>

      <div class="">
        <h2 class="text-2xl font-bold">Example</h2>
        <p>${word.sentence}</p>
      </div>

      <div class="">
        <h2 class="text-2xl font-bold">সমার্থক শব্দ গুলো</h2>
        <div class="">${createSynonym(word.synonyms || [])}</div>
      </div>
    `;
    document.getElementById('word-modal').showModal();
}

//  <span class="btn">${word.synonyms[0]}</span>
//         <span class="btn">${word.synonyms[1]}</span>
//         <span class="btn">${word.synonyms[2]}</span> 

// example object for code help 
// id:80
// level:1
// meaning:"দৌড়ানো"
// pronunciation:"রান"
// word:"Run"

const displayLevelWord = (words) => {
    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = ''; //empty inside container

    if(words.length == 0)
    {
       wordContainer.innerHTML= `<div class="text-center bg-sky-100 col-span-full rounded-xl py-10 space-y-6 bangla-font">
         <img class="mx-auto" src="./assets/alert-error.png" alt="">
          <p class="text-xl text-gray-400 font-medium ">নেক্সট Lesson এ যান</p>
          <p class="text-3xl font-bold">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        </div>`;
        manageSpinner(false);
       return;
    }

    words.forEach(word => {
        // console.log(word);
        const card = document.createElement('div');
        card.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm text-center py-10 px-10 space-y-3">
            <h2 class="font-bold text-2xl">${word.word ? word.word : "শব্দ পাওয়া যায় নি"}</h2>
            <p class="font-semibold">Meaning /Pronounciation</p>

            <div class="text-2xl font-medium font-bangla">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায় নি"}  / ${word.pronunciation ? word.pronunciation : "Pronunciation পাওয়া যায় নি"}"</div>

            <div class="flex justify-between items-center">
                <button onclick="loadWordDetail(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF60]"><i class="fa-solid fa-circle-info"></i></button>
                <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF60]"><i class="fa-solid fa-volume-high"></i></button>
            </div>

        </div>
        `

        wordContainer.appendChild(card);
    }
    );

    manageSpinner(false);

}

const displayLessons = lesson => {
    //    1.get the container and empty 

    const levelContainer = document.getElementById('level-container');
    levelContainer.innerHTML = ''; //empty inside container


    // 2.get into every lessons 

    for (let lessons of lesson) {

        // 3. create element (div) for every lesson 
        const btnDiv = document.createElement('div');
        btnDiv.innerHTML = `
        <button id="lesson-btn-${lessons.level_no}" onclick="loadLevelWord(${lessons.level_no})" class="btn btn-outline btn-primary lesson-btn" ><i class="fa-solid fa-book-open"></i> Lesson - ${lessons.level_no}</button>

        `;
        // 4. append the lesson to the container
        levelContainer.appendChild(btnDiv);


    }

}

loadLessons();