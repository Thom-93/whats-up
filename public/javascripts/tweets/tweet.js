window.addEventListener('DOMContentLoaded', () => {
  bindTweet();
  // tweetTime();
})

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

  elements.forEach( e => {
    e.addEventListener('click', ($event) => {
      const tweetId = $event.target.getAttribute('tweetid')
      console.log(tweetId);
      axios.delete('/letters/'+ tweetId)
           .then( function (response) {
            tweetContainer.innerHTML = response.data;
            bindTweet();
           })
           .catch( function(err) { console.log(err)} );
    })
  })
}