window.addEventListener('DOMContentLoaded', () => {
  bindTweet();
  // tweetTime();
});

function tweetTime() {
  let timeSpan = document.querySelectorAll('.tweet-time');

  // timeSpan.forEach( e => {
  //   const tweetTime = e.getAttribute('tweettime');
  //   const time = new Date(tweetTime).toLocaleTimeString() + ' ' + new Date(tweetTime).toLocaleDateString();
  //   timeSpan = `${time}`;
  //   console.log(time);
  //   console.log(timeSpan);
  // });

  // if (timeSpan) {
  //   const time =
  // }
}

function bindTweet() {
  const elements = document.querySelectorAll('.fa-trash-can');
  const tweetContainer = document.querySelector('#tweet-list-container');

  const divSecu = document.querySelector('#div-letter-secu');
  const liSecuYes = document.querySelector('#secu-yes');
  const liSecuNo = document.querySelector('#secu-no');

  if (tweetContainer) {
    elements.forEach((e) => {
      e.addEventListener('click', ($event) => {
        const tweetId = $event.target.getAttribute('tweetid');
        if (tweetId) {
          divSecu.style.visibility = 'visible';
          liSecuYes.addEventListener('click', () => {
            deleteLetter(tweetId);
            divSecu.style.visibility = 'hidden';
          });

          liSecuNo.addEventListener('click', () => {
            divSecu.style.visibility = 'hidden';
          });
        }
      });
    });

    const deleteLetter = (letterId) => {
      axios
        .delete('/letters/' + letterId)
        .then(function (response) {
          tweetContainer.innerHTML = response.data;
          bindTweet();
        })
        .catch(function (err) {
          console.log(err);
        });
    };
  }
}
