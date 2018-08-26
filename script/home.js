let rootUrl = "http://localhost:3000"
$("#new-post").on("click",() => {
    $("#post-form").toggle();
})
function fetchDataToWorkWith(dir)
{
    return fetch(rootUrl+dir)
     .then(res => res.json());
}
function getElements()
{
    let catigoriesList = $("#catigoriesList");
    fetchDataToWorkWith("/categories")
     .then(response=>{
          response.forEach(categorey=>{
             let categoreyButton = $("<a>")
             .attr("href","#")
             .addClass("customLink")
             .html(categorey.name);
             categoreyButton.on("click",()=>{
                    renderElements(categorey.name)
             })
             catigoriesList.append(categoreyButton);
          })
     })
}
getElements();
function renderElements(categoreyName)
{
    //<h6 class="text-right btn" id="comments">Comments</h3>
    let posts = $("#posts");
    let plaveHolder = $("<div>");
         fetch(rootUrl+"/posts")
          .then(res=>res.json())
          .then(response => {
              response.forEach(post => {
                  if(post.category === categoreyName)
                  {
                     let postdiv = $("<div>").addClass("col-lg-12 col-md-6 col-sm-12 postDiv")
                     postdiv.append(templateBuilder(post))
                     let actionsDiv = $("<div>");
                     addCommentButtonToPost(actionsDiv);
                    //  addDeleteButtonToPost(post,actionsDiv);
                    let delButton = $("<button>").addClass("btn delBtn myDel my-1").html("Delete");
                    delButton.on("click",() => {
                        console.log(post);
                    })
                    actionsDiv.append(delButton);
                     addEditButtonToPost(actionsDiv)
                     postdiv.append(actionsDiv);
                     plaveHolder.append(postdiv)            
                     appendRelatedCommentToPost(postdiv,post,post.id);
                     posts.html(plaveHolder)
                  }
              })
          })
}
function templateBuilder(obj)
{
         return `<p class='text-left'>${obj.title}</p>
            <span class='mb-2'>@${obj.owner}</span> 
            <p>${obj.body}`
}
function addCommentButtonToPost(postDiv)
{
    let commentButton = $("<button>").addClass("text-center btn").attr("id","comments").html("Add A Comment");
    commentButton.on("click",()=>{
        $("#post-form,#commentsForm").toggle();
        $("button").not("#cancelButton").attr("disabled","disabled").css({filter:"blur(3px)"});
         
         addSave();

    })
    postDiv.append(commentButton);
}
function renderEveryElement()
{
    let posts = $("#posts");
     let plaveHolder = $("<div>");
    fetchDataToWorkWith("/posts")
     .then(response => {
         response.forEach(post => {
            let postdiv = $("<div>").addClass("col-lg-12 col-md-12 col-sm-12 postDiv");
            postdiv.append(templateBuilder(post));
             let actionsDiv =$("<div>");
              let delButton = $("<button>").addClass("btn delBtn myDel my-1").html("Delete");
                    delButton.on("click",() => {
                        axios.delete(rootUrl+"/posts/"+post.id);
                    })
                    actionsDiv.append(delButton);
             addCommentButtonToPost(actionsDiv);
             addEditButtonToPost(actionsDiv,post)
             postdiv.append(actionsDiv)
             plaveHolder.append(postdiv)            
             appendRelatedCommentToPost(postdiv,post.id);
            posts.html(plaveHolder)
         })
     })
}
renderEveryElement();
function appendRelatedCommentToPost(postDiv,postId)
{
     fetchDataToWorkWith("/comments")
      .then(response=>{
          response.forEach(comment=>{
              if(comment.postId === postId.toString())
              {
                 let div = $("<div>").html(
                     `<p class=marginSetter>${comment.title} <br> 
                      @${comment.owner} <br> ${comment.body} </p>`
                 ).addClass("commentsDiv my-1")
                 postDiv.append(div);
              }
          })
      })
}
function addEditButtonToPost(postDiv,postObj)
{
    let editButton = $("<button>").addClass("btn editBtn myEdit far fa-edit").html(" Edit");
    editButton.on("click",() => {
        console.log("jsd")
      let inputsArray = $(".form-group input");
      addValueToInputFieldsForUpdating(postObj,inputsArray);
      $("button").not(`#cancelButton`).attr("diabled","disabled").css({filter:"blur(3px)"})
      let saveButton = $("<button>").addClass("btn btn-success mySave mt-2 far fa-save").attr("type","button").html(" Save");
      $(".form-group").append(saveButton);
      $("#post-form,#postsForm").show();
      addAdditionalFunctioNalitiy(saveButton);
      saveButton.on("click",() =>{
          sendUpdatedDataToDatabase(postObj,inputsArray);
          saveButton.remove();
          $("input,textarea").val("");
          $("button").prop("disabled",false).css({filter:"blur(0px)"});
          $("#post-form").toggle();
          renderEveryElement();
      })
    })
    postDiv.append(editButton);
}
function addAdditionalFunctioNalitiy(saveButton)
{
    $("#cancelButton").on("click",()=>{
         saveButton.remove();
         $("#post-form").toggle();
         $("input,textarea").val("");
         $("button").attr("disabled",false).css({filter:"blur(0px)"});
    })
}
function addValueToInputFieldsForUpdating(postObj,inputsArray)
{
    inputsArray[0].value = postObj.title;
    inputsArray[1].value = postObj.owner;
    inputsArray[1].setAttribute("disabled","disabled");
    $("textarea").val(postObj.body);
}
function sendUpdatedDataToDatabase(postObj,inputsArray)
{
    postObj.title = inputsArray[0].value;
    postObj.body = $("textarea").val();
    console.log(postObj);
    axios.put(rootUrl+"/posts/"+postObj.id,postObj);
}