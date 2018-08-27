let rootUrl = "http://localhost:3000";
console.log("1")
addElements();
class Updater{
        changeUserData(user,cols)
        {
            user.name = cols[0].value;
            user.email = cols[1].value;
            user.userName = cols[2].value;
            this.sendUpdatedData(user,"/users")
        }
        changePostData(post,cols)
        {
                post.title = cols[0].value;
                post.body = $("textarea").val();
                post.category = $("#cc input:checked").val();
                this.sendUpdatedData(post,"/posts")
        }
        changeCommentData(comment,col)
        {
              comment.title = col[0].value;
              comment.postId = col[1].value;
              comment.body =$("textarea").val();
              this.sendUpdatedData(comment,"/comments")
        }
        changeCatigoreyData(categorie,cols)
        {
                categorie.name = cols[0].value;
                this.sendUpdatedData(categorie,"/categories")
        }
        sendUpdatedData(obj,dir)
        {
              databaseConnector("PUT",dir,obj)
        }
}
let updaterObject = new Updater();
        $("#new-post").on("click",()=>{
              $("#post-form").toggle();
              $("#cc").toggle();
              $("#usersList").toggle();
              $("#postsList").toggle();
            })
        function addElements()
        {
                let cc = $("#cc");
                fetch(rootUrl+"/categories")
                 .then(res=>res.json())
                 .then(res=>{
                         res.forEach(element=>{
                               let a = $("<input>")
                                        .attr("type","radio")
                                        .attr("name","category")
                                        .val(element.name)
                                        .addClass("col-lg-3 col-sm-1 col-md-3")
                              let label  = $("<label>").html(element.name).addClass("col-lg-8 col-sm-4 col-md-7");
                              let div = $("<div>").addClass("border-bottom");
                              div.append([a,label]);
                              cc.append(div);
                         })
                 }) 
                 let xx = $("#usersList");
                 fetch(rootUrl+"/users")
                  .then(res=>res.json())
                  .then(response=>{
                          response.forEach(user=>{
                                  xx.append($("<div>").html(user.userName).addClass("border-bottom col-lg-12 py-1"));
                          })
                  })
                   
        }
// adding the main buttons functionnality 
        $("#clearButton").on("click",()=>{
                $(".form-control").val("")
        })
        $("#cancelButton").on("click",()=>{
                $("#post-form,#cc,#usersList").hide();
        })
        $("#comments").on("click",()=>{
        $(".c").addClass("card").toggle();
        })
        $("input,textarea").on({
                focus: ()=>{
                        $(".myNav").css({filter:"blur(20px)"})
                        $(".myNav a").css("pointer-events","none")
                },
                blur: () => {
                       $(".myNav").css({filter:"blur(0px)"})
                       $(".myNav a").css("pointer-events","initial")
                }
        })
$("#createUser").on("click",()=>{
         let obj = {
                 name:$("#name").val(),
                 email:$("#email").val(),
                 userName:$("#userName").val()
         }
        databaseConnector("POST","/users",obj);
        setInterval(() =>{
                reloadPage();
        },300)
})
$("#postCatigorey").on("click",()=>{
        let categorieName = $(".catigoreyTitle").val();
        databaseConnector("POST","/categories",{name:categorieName});
        setInterval(() =>{
                reloadPage();
        },300)
})
$("#postButton").on("click",()=>{
        let ownerOfPost = $("#owner-of-post").val();
        let postObj = {
                title:$("#title").val(),
                body:$("textarea").val(),
                owner:ownerOfPost,
                userId:"",
                category:$("#cc input:checked").val(),
                categoryId:""
        }
           findUserId(postObj,ownerOfPost,"/posts") // finding the userId and after that finding the categoryId
})
$("#postComment").on("click",()=>{
          let commentOwner = $("#owner-of-comment").val();
          let commentObj = {
               body:$("textarea").val(),
               owner:commentOwner,
               title: $(".commentTitle").val(),
               postId: $(".postId").val(),
               userId:""
          }
          findUserId(commentObj,commentOwner,"/comments");
})
function findCategoryId(postObject)
{
        fetchDataFromDataBaseToWorkWith("/categories")
         .then(response => {
                 response.forEach(category => {
                         if(category.name === postObject.category)
                         {
                                 postObject.categoryId = category.id;
                                 databaseConnector("POST","/posts",postObject)
                                 setInterval(() =>{
                                        reloadPage();
                                },300)
                         }
                 })
         })
}
function findUserId(obj,owner,dir)
{
        fetchDataFromDataBaseToWorkWith("/users")
         .then(response => {
                 response.forEach(userObject => {
                        if(userObject.userName === owner)
                        {
                                console.log("salliknis")
                            if(dir === "/comments") // if it is a comment object 
                             {
                                     obj.userId = userObject.id;
                                     databaseConnector("POST","/comments",obj);
                                     setInterval(() =>{
                                        reloadPage();
                                },300)
                             }
                             if(dir === "/posts") // it is a post object
                             {
                                      obj.userId = userObject.id;
                                      findCategoryId(obj);
                             }
                        }
                 })
         })
}
function databaseConnector(method,dir,obj)
{
        let directory = rootUrl+dir;
        switch(method)
        {
           case "POST":
           axios.post(directory,obj)
           break;
          case "DELETE":
          {
            deleteLinksToThisObject(obj,dir)
            axios.delete(directory+"/"+obj.id);
          }
           break;
          case "PUT":
           axios.put(directory+"/"+obj.id,obj)
           break;
        }

}
function deleteLinksToThisObject(obj,dir) 
{
        switch(dir)
        {
          case "/users": // if its a user object then delete every post and comment made by this user
          {
          deletePostsRelatedToUser("DELETE","/posts",obj);
          deleteCommentsRelatedToUser("DELETE","/comments",obj);
          }
          break;
          case "/posts": // if its a post object then delete every comment made on that post 
          deleteCommentsRelatedToPost(obj);
          break;
          case "/categories":
           removeCategoreyFromPosts(obj); // if its a category object then change all the posts with that 
        }                                //category and re-assign there categorey to uncategorized
}
function fetchDataFromDataBaseToWorkWith(dir) //a genreic function that fetchs data from the server
{                                             //it returns a promise object 
       return fetch(rootUrl+dir)
         .then(res=>res.json())
}
function removeCategoreyFromPosts(categorie) 
{
        fetchDataFromDataBaseToWorkWith("/posts")
         .then(response => {
                 response.forEach(post => {
                       if(post.category === categorie.name) //if the post category is equal to the one being removed
                       {                                   // re- initialize the post category to Uncatagorized
                        post.category = "Uncatagorized";
                        databaseConnector("PUT","/posts",post);
                       }
                 })
         })
}
function deleteCommentsRelatedToUser(user) //when a user is deleted this function will find and delete every 
{                                         // comment made by that user
        fetchDataFromDataBaseToWorkWith("/comments")
         .then(response=>{
                 response.forEach(comment =>{
                         if(comment.userId === user.id)
                          databaseConnector("DELETE","/comments",comment)
                 })
         })
}
function deletePostsRelatedToUser(user)//when a user is delted this function will delete every post made by that user
{
      fetchDataFromDataBaseToWorkWith("/posts")
       .then(response =>{
               response.forEach(post=>{
                       if(post.userId === user.id)
                       {
                         deleteCommentsRelatedToPost(post);//since we are deleting a post we also need to delete
                                                            // every comment made on that post no matter who is the user
                         databaseConnector("DELETE","/posts",post);
                       }
               })
       })
}
function deleteCommentsRelatedToPost(post) //this function will delete every comment related to a post 
{                                          // when that post is deleted
    fetchDataFromDataBaseToWorkWith("/comments")
     .then(response =>{
             response.forEach(comment=>{
                     if(comment.postId === post.id.toString()) // because the postId is a Number we need to convert it to string
                      databaseConnector("DELETE","/comments",comment);
             })
     })
}
function addDeleteButtonToTable(td,directory,obj) //this function takes an table data and adds a delete button 
{                                                 //with complete functionnality
        let delBtn =  $("<button>").addClass("btn delBtn mx-1 my-1 fas fa-trash-alt").html("  Delete");
        delBtn.on("click",()=>{
                databaseConnector("DELETE",directory,obj) // here we are passing a reference to the object that will 
               //be linked with this delete button
              setInterval(() =>{
                      reloadPage();
              },300)
        })
        td.append(delBtn);
}
function addValueToInputFieldsForUpdating(dir,obj,inputsArray)
{
        switch(dir)
        {
                case "/posts":
                {
                        inputsArray[0].value=obj.title;
                        inputsArray[1].value=obj.owner;
                        inputsArray[1].setAttribute("disabled","disabled")  // so the user will not edit the userName
                        $("textarea").val(obj.body)
                }
                break;
                case "/users":
                {
                        inputsArray[0].value=obj.name;
                        inputsArray[1].value=obj.email;
                        inputsArray[2].value= obj.userName;
                }
                break;
                case "/comments":
                {
                        $(".comments-form").show();
                        inputsArray[0].value = obj.title;
                        inputsArray[1].value = obj.postId;
                        inputsArray[2].value = obj.owner;
                        inputsArray[2].setAttribute("disabled","disabled")
                        $("textarea").val(obj.body)
                }
                break;
                case "/categories":
                {
                        inputsArray[0].value = obj.name;
                }
                break;
        }
}

function addEditButtonToTable(td,directory,obj)// adding a edit button to a table data with a reference to an object 
{                                              // that will ne linked with
        let editBtn = $("<button>").addClass("btn editBtn mx-1 far fa-edit").html(" Edit");
        let inputsArray = $("#post-form input"); //retreving the inputs so we can re-assign the values for editing
          editBtn.on("click",()=>{
        addValueToInputFieldsForUpdating(directory,obj,inputsArray);
         let saveButton = $("<button>").addClass("btn btn-success mt-2 far fa-save").html(" Save");
        addNewFuctionality(editBtn,saveButton)
        $("#cc").show()
        $(".form-group").append(saveButton);
             saveButton.on("click",()=>{
                callUpdater(directory,obj,inputsArray) // an updater function that will call the updater class to 
                                                    //update the object 
                        saveButton.remove(); 
                        setInterval(() =>{
                                reloadPage();
                        },300)
                     })
               })
               td.append(editBtn)        
}
function addNewFuctionality(editBtn,saveButton)
{
        editBtn.hide();
        $("#post-form").show();
        //disableing every button accept the cancel button
        $("button").not($("#cancelButton")).attr("disabled","disabled").css({filter:"blur(3px)"});
        $("#cancelButton").on("click",()=>{
                $("button").attr("disabled",false).css({filter:"blur(0px)"}); // removing the disabled state
                $("input").val(""); //re-assign the inputs to original content
                $("textarea").val("");
                 saveButton.remove();
                 editBtn.show();
                 $("#cc").hide(); // hiding the form
                 $("#usersList").hide();
        });
}
function callUpdater(dir,obj,cols) // this is just a caller function that calls the right method of the Updater class
{
        switch(dir)
        {
        case "/posts": 
                updaterObject.changePostData(obj,cols);
        break;
        case "/users": // if we are updating a user so we need update the user name in the posts and comments made 
              {       // made by that user
                updaterObject.changeUserData(obj,cols);
                updatePostsRelatedToUser(obj);
                updateCommentsRelatedToUser(obj);
              }
        break;
        case "/comments":
                updaterObject.changeCommentData(obj,cols);
        break;
        case "/categories": //if we are updating a category name we also need update the current post with the old
              {             // category name so their categoty is up to date
                updaterObject.changeCatigoreyData(obj,cols);
                 updatePostsRelatedToCategoryObject(obj);
              }
        break;
        }
}
function updatePostsRelatedToCategoryObject(categoryObject) // function that updates the category in the posts 
{
        fetchDataFromDataBaseToWorkWith("/posts")
         .then(response => {
                 response.forEach(post => {
                         if(post.categoryId === categoryObject.id)
                         {
                                 post.category = categoryObject.name;
                                 databaseConnector("PUT","/posts",post);
                         }
                 })
         })
}
function updatePostsRelatedToUser(userObject)
{
        fetchDataFromDataBaseToWorkWith("/posts")
         .then(response => {
                 response.forEach(postObject => {
                         if(postObject.userId === userObject.id)
                          {
                             postObject.owner= userObject.userName;
                             databaseConnector("PUT","/posts",postObject);
                          }
                 })
         })
}
function updateCommentsRelatedToUser(userObject)
{
        fetchDataFromDataBaseToWorkWith("/comments")
         .then(response => {
                 response.forEach(commentObject => {
                         if(commentObject.userId === userObject.id)
                          {
                                  commentObject.owner = userObject.userName;
                                  databaseConnector("PUT","/comments",commentObject);
                          }
                 })
         })
}
function reloadPage(){ // just a function that will reload the page when called
        location.reload();
}
function callRender() // caller function that calls the getData function
{
        getData("/users","usersTable");
        getData("/categories","CatigoryTable");
        getData("/comments","commentsTable");
        getData("/posts","postsTable");
}
const render = { // an object that holds the rules for rendering the object
        "posts":(post,tablePlaceHolder)=>{
                let tr = $("<tr>").append([
                        $("<td>").html(post.id),
                        $("<td>").html(post.title),
                        $("<td>")
                        .html(post.body.substring(0,20).concat("..."))])  ;
                        let td = $("<td>");
                        $("#postsList").append($("<p>").html(
                                `<span>Post Title</span>: ${post.title} <br>
                                 <span> Post Owner:</span> ${post.owner} <br>
                                 <span> Post Id:</span> ${post.id}`
                        ).addClass("border-bottom line"));
                        addActionButtons(tr,td,"/posts",tablePlaceHolder,post);
        },
        "comments":(comment,tablePlaceHolder)=>{
                let tr = $("<tr>").append([
                        $("<td>").html(comment.id),
                        $("<td>").html(comment.body.substring(0,20).concat("....."))]);
                        let td = $("<td>");
                        addActionButtons(tr,td,"/comments",tablePlaceHolder,comment);
        },
        "users":(user,tablePlaceHolder)=>{
                let tr = $("<tr>").append([
                        $("<td>").html(user.id),
                        $("<td>").html(user.name),
                        $("<td>").html(user.userName)
                                         ]);
                          
                          let td = $("<td>");
                          addActionButtons(tr,td,"/users",tablePlaceHolder,user);
        },
        
        "categories":(categorie,tablePlaceHolder)=>{
                let tr = $("<tr>")
                            .append([
                                $("<td>").html(categorie.id),
                                $("<td>").html(categorie.name)
                             ]);
                let td = $("<td>");
                addActionButtons(tr,td,"/categories",tablePlaceHolder,categorie);
        }
        
}
function getData(dir,table) // a function that calls the specific render method to render it 
{
       fetchDataFromDataBaseToWorkWith(dir)
         .then(response=>{
                 let tablePlaceHolder = findTable(table); // find which is the table that we are adding to
                 switch(dir)
                 {
                        case "/users":
                                response.forEach(user=>{
                                render.users(user,tablePlaceHolder);
                        })
                        break;
                        case "/posts": 
                                response.forEach(post=>{
                                render.posts(post,tablePlaceHolder);
                        })
                        break;
                        case "/comments":  
                                response.forEach(comment=>{
                          
                                        render.comments(comment,tablePlaceHolder);
                        })
                        break;
                        case "/categories": 
                                response.forEach(categorie=>{
                                render.categories(categorie,tablePlaceHolder);
                        })
                        break;
                }
         })
}
function addActionButtons(tr,td,dir,tbody,obj)
{
        addEditButtonToTable(td,dir,obj);
        addDeleteButtonToTable(td,dir,obj);
        tr.append(td);
        tbody.append(tr);
}
callRender();
 function findTable(Class)
{
        return $(`.${Class} tbody`);
}