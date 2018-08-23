let rootUrl = "http://localhost:3000";
addElements();
class Updater{
        changeUserData(user,cols)
        {
                console.log("asdkjjgsa")
            user.name = cols[0].value;
            user.email = cols[1].value;
            user.userName = cols[2].value;
            this.sendUpdatedData(user,"/users")
        }
        changePostData(post,cols)
        {
                post.title = cols[0].value;
                post.body = $("textarea").val();
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
                                        .attr("id","materialChecked2")
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

        $("#clearButton").on("click",()=>{
                $(".form-control").html(" ")
        })
        $("#cancelButton").on("click",()=>{
                $("#post-form").hide();
        })
        $("#comments").on("click",()=>{
        $(".c").addClass("card").toggle();
        })
$("#cc:has(input:checked)").css({background:"red"})
$("#createUser").on("click",()=>{
         let obj = {
                 name:$("#name").val(),
                 email:$("#email").val(),
                 userName:$("#userName").val()
         }
        databaseConnector("POST","/users",obj)    
})

$("#postButton").on("click",()=>{
        let ownerOfPost = $("#owner-of-post").val();
        let postObj = {
                title:$("#title").val(),
                body:$("textarea").val(),
                owner:ownerOfPost,
                userId:"",
                category:$("#cc input:checked").val()
        }
         findUserId("/posts",postObj,ownerOfPost)      
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
          findUserId("/comments",commentObj,commentOwner);
})
function findUserId(dir,obj,owner)
{
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("load",()=>{
               let users = JSON.parse(xhr.responseText);
               users.forEach(element => {
                       if(element.userName=== owner)
                       {
                               if(obj.hasOwnProperty("postId"))
                               {
                                  obj.userId=element.id;
                                 databaseConnector("POST","/comments",obj)
                               }
                               else{
                                       obj.userId=element.id
                                      databaseConnector("POST","/posts",obj)
                               }
                }
               });
        })
        xhr.open("GET",rootUrl+"/users");
        xhr.send();
}
$("#postCatigorey").on("click",()=>{
        let categorieName = $(".catigoreyTitle").val();
        databaseConnector("POST","/categories",{name:categorieName});
})
function databaseConnector(method,dir,obj)
{
        let directory = rootUrl+dir;
        if(method === "POST")
        {
          axios.post(directory,obj)
        }
        if(method === "DELETE")
        {
                axios.delete(directory+"/"+obj.id);
        }
        if(method === "PUT")
        {
                axios.put(directory+"/"+obj.id,obj)
        }
}
function addDeleteButtonToTable(td,directory,obj)
{
        let delBtn =  $("<button>").addClass("btn delBtn mx-1 my-1 fas fa-trash-alt").html("  Delete");
        delBtn.on("click",()=>{
                databaseConnector("DELETE",directory,obj)
        })
        td.append(delBtn);
}
function addEditButtonToTable(td,directory,obj)
{

        let editBtn = $("<button>").addClass("btn editBtn mx-1 far fa-edit").html(" Edit");
        let cols = $("#post-form input");
        editBtn.on("click",()=>{
                if(directory === "/users")
                {
                        cols[0].value=obj.name;
                        cols[1].value=obj.email;
                        cols[2].value= obj.userName;
                }
                if(directory === "/posts")
                {
                        cols[0].value=obj.title;
                        cols[1].value=obj.owner;
                        cols[1].setAttribute("disabled","disabled")
                        $("textarea").val(obj.body)
                }
                if(directory === "/comments")
                {
                        $(".comments-form").show();
                        cols[0].value = obj.title;
                        cols[1].value = obj.postId;
                        cols[2].value = obj.owner;
                        cols[2].setAttribute("disabled","disabled")
                        $("textarea").val(obj.body)
                }
                if(directory === "/categories")
                {
                        cols[0].value = obj.name
                }
                $("#new-post").attr("disabled", "disabled")
                     editBtn.hide();
                     $("#post-form").show();
                     let saveButton = $("<button>").addClass("btn btn-success mt-2 far fa-save").html(" Save");
                     $(".form-group").append(saveButton);
                     saveButton.on("click",()=>{
                        callUpdater(directory,obj,cols)
                         $("#new-post").prop("disabled", false);
                         saveButton.remove();
                     })
               })
               td.append(editBtn)        }
function callUpdater(dir,obj,cols)
{
        switch(dir)
        {
        case "/posts": 
                updaterObject.changePostData(obj,cols);
        break
        case "/users":
                updaterObject.changeUserData(obj,cols);
        break;
        case "/comments":
        break;
                updaterObject.changeCommentData(obj,cols)
        case "/categories":
                updaterObject.changeCatigoreyData(obj,cols)
        }
}
function reloadPage(){
        Window.loacation.reload();
}
function callRender()
{
        getData("/users","usersTable");
        getData("/categories","CatigoryTable")
        getData("/comments","commentsTable")
        getData("/posts","postsTable")
}
const render = {
        "posts":(post,tablePlaceHolder)=>{
                let tr = $("<tr>").append([
                        $("<td>").html(post.id),
                        $("<td>").html(post.title),
                        $("<td>")
                        .html(post.body.substring(0,20).concat("..."))])  
                        let td = $("<td>");
                        $("#postsList").append($("<p>").html(
                                `<span>Post Title</span>: ${post.title} <br>
                                 <span> Post Owner:</span> ${post.owner} <br>
                                 <span> Post Id:</span> ${post.id}`
                        ).addClass("border-bottom line"))
                        addActionButtons(tr,td,"/posts",tablePlaceHolder,post)
        },
        "comments":(comment,tablePlaceHolder)=>{
                let tr = $("<tr>").append([
                        $("<td>").html(comment.postId),
                        $("<td>").html(comment.body)])
                        let td = $("<td>");
                        addActionButtons(tr,td,"/comments",tablePlaceHolder,comment)
        },
        "users":(user,tablePlaceHolder)=>{
                let tr = $("<tr>").append([
                        $("<td>").html(user.id),
                        $("<td>").html(user.name),
                        $("<td>").html(user.userName)
                   ]);
                          
                          let td = $("<td>");
                          addActionButtons(tr,td,"/users",tablePlaceHolder,user)
        },
        "categories":(categorie,tablePlaceHolder)=>{
                let tr = $("<tr>")
                .append([
                        $("<td>").html(categorie.id),
                        $("<td>").html(categorie.name)
                ])
                let td = $("<td>");
                addActionButtons(tr,td,"/categories",tablePlaceHolder,categorie)
        }
        
}
function getData(dir,table)
{
        fetch(rootUrl+dir)
         .then(res=>res.json())
         .then(response=>{
                 let tablePlaceHolder = findTable(table);
                 switch(dir)
                 {
                        case "/users":
                                response.forEach(user=>{
                                render.users(user,tablePlaceHolder)
                        })
                        break;
                        case "/posts": 
                                response.forEach(post=>{
                                render.posts(post,tablePlaceHolder)
                        })
                        break;
                        case "/comments":  
                                response.forEach(comment=>{
                                render.comments(comment,tablePlaceHolder)
                        })
                        break
                        case "/categories": 
                                response.forEach(categorie=>{
                                render.categories(categorie,tablePlaceHolder)
                        })
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
