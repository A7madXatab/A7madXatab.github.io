let rootUrl = "http://localhost:3000";
addElements();
class Updater{
        changeUserData(user,cols)
        {
            user.name = cols[0].value;
            user.email = cols[1].value;
            user.userName = cols[2].value;
            add__Delete__Edit("PUT","/users",user);
        }
        changePostData(post,cols)
        {
                post.title = cols[0].value;
                post.body = $("textarea").val();
                console.log(post);
                add__Delete__Edit("PUT","/posts",post);
        }
        changeCommentData(comment,col)
        {
              comment.title = col[0].value;
              comment.postId = col[1].value;
              comment.body =$("textarea").val();
               add__Delete__Edit("PUT","/comments",comment)
        }
}

let x = new Updater();
        $("#new-post").on("click",()=>{
              $("#post-form").toggle();
              $("#cc").toggle();
              $("#usersList").toggle();;
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
                                        .addClass("col-lg-3 col-sm-1")
                              let label  = $("<label>").html(element.name).addClass("col-lg-8 col-sm-4");
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
         let name = $("#name").val();
         let userEmail = $("#email").val(); 
         let userName = $("#userName").val();
         console.log(userName)
         let obj = {
                 name:name,
                 email:userEmail,
                 userName:userName
         }
        add__Delete__Edit("POST","/users",obj)    
})

$("#postButton").on("click",()=>{
        
        let category = $("#cc input:checked").val();
        let postTitle = $("#title").val();
        let ownerOfPost = $("#owner-of-post").val();
        let postBody =$("textarea").val();
        let userId;
        let postObj = {
                title:postTitle,
                body:postBody,
                owner:ownerOfPost,
                userId:userId,
                category:category
        }
        findUserId("/posts",postObj,ownerOfPost)      
})
$("#postComment").on("click",()=>{
          let commentOwner = $("#owner-of-comment").val();
          let commentBody = $("textarea").val();
          let commentTitle = $(".commentTitle").val();
          let postid = $(".postId").val();
          let commentObj = {
               body:commentBody,
               owner:commentOwner,
               title:commentTitle,
               postId:postid,
               userId:""
          }
          findUserId("/comments",commentObj,commentOwner);
})
function findUserId(dir,obj,owner)
{
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("load",()=>{
               let users = JSON.parse(xhr.responseText);
               if(dir ==="/posts")
               {
                       console.log("asdlljbgas")
               users.forEach(element => {
                       if(element.userName=== owner)
                       {
                        obj.userId=element.id;
                        console.log(obj)
                        add__Delete__Edit("POST","/posts",obj)
                        break;
                }
               })};
               if(dir === "/comments")
               {
                users.forEach(element => {
                        if(element.userName=== owner)
                        {
                              obj.userId=element.id
                          add__Delete__Edit("POST","/comments",obj)
                          break;
                 }
                })
               }
        })
        xhr.open("GET",rootUrl+"/users");
        xhr.send();
}
$("#postCatigorey").on("click",()=>{
        let categorieName = $(".catigoreyTitle").val();
        add__Delete__Edit("POST","/categories",{name:categorieName});
})
function add__Delete__Edit(method,dir,obj)
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
function deleteButton(td,directory,obj)
{
        let delBtn =  $("<button>").addClass("btn delBtn mx-1 fas fa-trash-alt").html("  Delete");
        delBtn.on("click",()=>{
                add__Delete__Edit("DELETE",directory,obj)
        })
        td.append(delBtn);
}
function editButton(td,directory,obj)
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
                $("#new-post").attr("disabled", "disabled")
                     editBtn.hide();
                     $("#post-form").show();
                     let saveButton = $("<button>").addClass("btn btn-success mt-2 far fa-save").html(" Save");
                     $(".form-group").append(saveButton);
                     saveButton.on("click",()=>{
                         if(directory === "/users")
                         {
                                 x.changeUserData(obj,cols);
                                 $(".form-control").val("");
                                 saveButton.remove();
                                 editBtn.show();
                         }
                         if(directory === "/posts")
                         {
                                 x.changePostData(obj,cols);
                                 $(".form-control").val("");
                                  $(".posts-form").show();
                         }
                         if(directory === "/comments")
                         {
                              x.changeCommentData(obj,cols)

                         }
                         $("#new-post").prop("disabled", false);
                         saveButton.remove();
                     })
               })
               td.append(editBtn)
        }
function callRender()
{
        R("/users","usersTable");
        R("/categories","CatigoryTable")
        R("/comments","commentsTable")
        R("/posts","postsTable")
}
function R(dir,table)
{
        fetch(rootUrl+dir)
         .then(res=>res.json())
         .then(response=>{
                 let tablePlaceHolder = findTable(table);
                 if(dir === "/users")
                 {
                 response.forEach(user=>{
                        let tr = $("<tr>").append([
                       $("<td>").html(user.id),
                       $("<td>").html(user.name),
                       $("<td>").html(user.userName)
                  ]);
                         
                         let td = $("<td>");
                     editButton(td,dir,user);
                     deleteButton(td,dir,user);
                     tr.append(td);
                     tablePlaceHolder.append(tr);
                 })}
                 if(dir ==="/categories")
                 {
                        response.forEach(categorie=>{
                                let tr = $("<tr>")
                                        .append([
                                                $("<td>").html(categorie.id),
                                                $("<td>").html(categorie.name)
                                        ])
                                        let td = $("<td>");
                                        editButton(td,dir,categorie);
                                        deleteButton(td,dir,categorie);
                                        tr.append(td);
                                        tablePlaceHolder.append(tr);
                        })
                 }
                 if(dir === "/posts")
                 {
                        response.forEach(post=>{
                          let tr = $("<tr>").append([
                            $("<td>").html(post.id),
                            $("<td>").html(post.title),
                            $("<td>").html(post.body)])  
                            let td = $("<td>");
                            editButton(td,"/posts",post);
                            deleteButton(td,"/posts",post)
                            tr.append(td);
                            tablePlaceHolder.append(tr);
                        })
                 }
                 if(dir === "/comments")
                 {
                        response.forEach(comment=>{
                                let tr = $("<tr>").append([
                                        $("<td>").html(comment.postId),
                                        $("<td>").html(comment.body)])
                                        let td = $("<td>");
                                        editButton(td,"/comments",comment)
                                        deleteButton(td,"/comments",comment)
                                        tr.append(td);
                                        tablePlaceHolder.append(tr);
                              })
                 }
         })
}
callRender();
 function findTable(Class)
{
        return $(`.${Class} tbody`);
}
// axios.post(rootUrl+"/users",{
//         name:"Dummy",
//         userName:"Dummy"
// })