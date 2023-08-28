window.onload = function() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            replySection = null
            currentUser = data.currentUser.username 
            currentUserImage = data.currentUser.image.png
            document.querySelector("#currentUserImage").src = currentUserImage

            function upScore(commentId, data) {
                var responses = document.querySelectorAll("section")
                responses.forEach(function(element) {
                    var attribute = element.getAttribute("data-response-id")
                    if (attribute == commentId) {
                        var actualNumber = Number(element.querySelector("#likes").textContent)
                        element.querySelector("#likes").textContent = actualNumber + 1
                        var button = element.querySelector("[data-increment")
                        button.classList.add("pointer-events-none"); 
                    }
                });
            }

            function downScore(commentId, data) {
                var responses = document.querySelectorAll("section")
                responses.forEach(function(element) {
                    var attribute = element.getAttribute("data-response-id")
                    if (attribute == commentId) {
                        var actualNumber = Number(element.querySelector("#likes").textContent)
                        element.querySelector("#likes").textContent = actualNumber - 1
                        var button = element.querySelector("[data-reduce")
                        button.classList.add("pointer-events-none"); 
                    }
                });
            }

            function deleteComment(commentId, data) {
                var responses = document.querySelectorAll("section")
                responses.forEach(function(element) {
                    var attribute = element.getAttribute("data-response-id")
                    if (attribute == commentId) {
                        element.remove();
                    }
                });
                            
            }

            function generateUniqueNumericId() {
                var timestamp = new Date().getTime();
                var random = Math.floor(Math.random() * 10000);
                var uniqueId = timestamp + random;
                return uniqueId;
            }

            function addUserComment(text) {
                var id = generateUniqueNumericId()
                var message = response(id, currentUserImage, currentUser, "Now", text, 0, false, true)
                document.querySelector("#main").innerHTML += message
                updateData()
            }

            function addUserReply(text) {
                var id = generateUniqueNumericId()
                var message = response(id, currentUserImage, currentUser, "Now", text, 0, true, true)
                replySection.insertAdjacentHTML('afterend', message);
                var existingReplySections = document.querySelectorAll('[data-isreply="true"]');
                existingReplySections.forEach(function(section) {
                    section.remove();
                });
                updateData()
            }

            function response(id, image, username, createdAt, content, score, isReply, isCurrentUser) {
                style = ""
                icon = ""
                responseText = ""
                hideDelete = ""
                replyOrEdit = ""
                if (isReply) {
                    style = "reply"
                } else {
                    style = "response"
                }
                if (isCurrentUser) {
                    icon = '<svg class="mt-[0.3rem]" width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z" fill="#5357B6"/></svg>'
                    responseText = "Edit"
                    hideDelete = "flex"
                    replyOrEdit = "edit"
                } else {
                    icon = '<svg class="mt-[0.3rem]" width="14" height="13" xmlns="http://www.w3.org/2000/svg"><path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" fill="#5357B6"/></svg>'
                    responseText = "Reply"
                    hideDelete = "hidden"
                    replyOrEdit = "reply"
                }
                message = `
                <section data-type="` + style + `" data-response-id="`+ id +`" class="` + style + ` bg-white shadow-sm flex flex-wrap rounded-xl mb-5 relative">
                    <header class="w-full flex flex-wrap mt-5 lg:ml-[3rem]">
                        <img id="image" src="`+ image +`" class="mb-4 ml-5 mr-5 w-8 h-8 rounded-full ">
                        <span id="name" class="text-gray-700 font-bold">`+ username +`</span>
                        <span id="isUser" class="hidden bg-indigo-700 text-[0.9rem] pl-[0.3rem] pr-[0.3rem] h-[1.3rem] text-white ml-[0.5rem]">you</span>
                        <span id="date" class="text-gray-500 ml-5">`+ createdAt +`</span>
                    </header>
                    <p id="message" class="px-5 mb-5 text-gray-500 pb-[3rem] lg:pb-0 lg:ml-[3rem]">
                        `+ content +`
                    </p>
                    <div class="flex flex-wrap lg:flex-col absolute bottom-[1.5rem] left-[1rem] lg:top-[1.2rem] lg:bottom-auto ">
                        <div data-increment="increment" data-id="`+ id +`" class="flex bg-slate-100 rounded-l-lg lg:rounded-b-none lg:rounded-t-lg w-5 lg:w-9 h-7 px-3 text-lg justify-center text-center font-bold text-slate-300 hover:text-slate-500 cursor-pointer">
                            +
                        </div>
                        <div id="likes" class="flex bg-slate-100 w-5 lg:w-9 h-7 px-3 pt-[0.2rem] justify-center text-center font-bold text-slate-500">
                            `+ score +`
                        </div>
                        <div data-reduce="reduce" data-id="`+ id +`" class="flex bg-slate-100 rounded-r-lg lg:rounded-t-none lg:rounded-b-lg w-5 lg:w-9 h-7 px-3 text-lg justify-center text-center font-bold text-slate-300 hover:text-slate-500 cursor-pointer">
                            -
                        </div>
                    </div>
                    <div data-action="delete" data-id="`+ id +`" class="`+ hideDelete +` flex flex-wrap text-red-600 hover:text-red-400 cursor-pointer absolute bottom-[1.5rem] right-[6rem] lg:top-[1.2rem] lg:bottom-auto">
                        <svg class=" mt-[0.3rem]" width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z" fill="#ED6368"/></svg>
                        <span class="ml-2 font-bold">Delete</span>
                    </div>
                    <div id="` + replyOrEdit + `" class="flex flex-wrap text-indigo-700 hover:text-indigo-500 cursor-pointer absolute bottom-[1.5rem] right-[1rem] lg:top-[1.2rem] lg:bottom-auto">
                        `+ icon +`
                        <span class="ml-2 font-bold">`+responseText+`</span>
                    </div>
                </section>`
                return message
            }
            let messagesHTML = ""
            data.comments.forEach(comment => {
                let messages = ""
                if (comment.user.username == currentUser) {
                    messages = response(comment.id, comment.user.image.png, comment.user.username, comment.createdAt, comment.content, comment.score, false, true)    
                } else {
                    messages = response(comment.id, comment.user.image.png, comment.user.username, comment.createdAt, comment.content, comment.score, false, false)
                }
                messagesHTML += messages

                
                
                if (comment.replies.length > 0) {
                    comment.replies.forEach(reply => {
                        let msg = ""
                        if (reply.user.username == currentUser) {
                            msg = response(reply.id, reply.user.image.png, reply.user.username, reply.createdAt, reply.content, reply.score, true, true)
                        } else {
                            msg = response(reply.id, reply.user.image.png, reply.user.username, reply.createdAt, reply.content, reply.score, true, false)
                        }
                        
                        messagesHTML += msg
                    });
                };
                
              });

            document.querySelector("#main").innerHTML += messagesHTML

            var sendResponse = document.querySelectorAll("#replyBtn");
            sendResponse.forEach(function(element) {
                element.addEventListener("click", function(event) {
                    event.preventDefault();
                    var replyInput = document.querySelector("#replyInput").value;
                    document.querySelector("#replyInput").value = ""
                    addUserComment(replyInput)
                });
            });

            function updateData() {
                var incrementButton = document.querySelectorAll("[data-increment]");
                incrementButton.forEach(function(element) {
                    element.addEventListener("click", function(event) {
                        event.preventDefault();
                        var dataId = event.target.getAttribute("data-id");
                        upScore(dataId, data)
                    });
                });
    
                var reduceButton = document.querySelectorAll("[data-reduce]");
                reduceButton.forEach(function(element) {
                    element.addEventListener("click", function(event) {
                        event.preventDefault();
                        var dataId = event.target.getAttribute("data-id");
                        downScore(dataId, data)
                    });
                });
    
                var deleteButton = document.querySelectorAll("[data-action='delete']");
                deleteButton.forEach(function(element) {
                    element.addEventListener("click", function(event) {
                        event.preventDefault();
                        var dataId = element.getAttribute("data-id");
                        deleteComment(dataId, data)
                    });
                });
    
                
                var replyCommentButton = document.querySelectorAll("#reply");
                    replyCommentButton.forEach(function(element) {
                        element.addEventListener("click", function(event) {
                        event.preventDefault();
                        var existingReplySections = document.querySelectorAll('[data-isreply="true"]');
                        existingReplySections.forEach(function(section) {
                            section.remove();
                        });
                        
                        var newDiv = document.createElement("div");
                        newDiv.innerHTML = `
                            <section data-type="reply" data-isreply="true" data-response-id="test" class="reply bg-white shadow-sm flex flex-wrap rounded-xl mb-5 relative">
                                <div id="replyUserBox" class="bg-white shadow-sm flex lg:flex-col flex-wrap rounded-xl w-[90%] mx-auto 
                                    lg:w-[46rem] lg:relative"><textarea id="replyUserInput" class="lg:ml-5 w-[90%] lg:w-[72%] lg:ml-[5rem] h-24 
                                    border mx-auto mt-5 rounded-lg mb-5 resize-none pt-1 pl-3" placeholder="Add a comment..."></textarea>
                                    <img id="userImage" src="`+ currentUserImage +`" class="mb-4 ml-5 mr-5 w-10 h-10 
                                    rounded-full lg:absolute lg:mt-5"><button id="replyUserBtn" class="bg-indigo-700 hover:bg-indigo-400 
                                    text-white font-bold rounded-lg px-5 py-2 mb-5 ml-[8rem] lg:absolute lg:right-5 lg:top-0 lg:mt-5 
                                    uppercase">Send</button>
                                </div>
                            </section>`;
    
                        replySection = element.closest('[data-type="reply"]');
                        if (replySection) {
                            replySection.insertAdjacentElement('afterend', newDiv);
                            updateData()
                        } else {
                            replySection = element.closest('[data-type="response"]');
                            replySection.insertAdjacentElement('afterend', newDiv);
                            updateData()
                        }
                    });
                });

                var editCommentButton = document.querySelectorAll("#edit");
                editCommentButton.forEach(function(element) {
                    element.addEventListener("click", function(event) {
                        event.preventDefault();
                        
                        var messageElement = this.parentNode.querySelector("#message");
                        var messageText = messageElement.textContent.trim(); // Use trim()

                        var textareaElement = document.createElement("textarea");
                        textareaElement.value = messageText;
                        textareaElement.classList.add("lg:ml-5", "w-[90%]", "lg:w-[72%]", "lg:ml-[5rem]", "h-24", "border", "mx-auto", "mt-5", "rounded-lg", "mb-5", "resize-none", "pt-1", "pl-3");
                        
                        messageElement.parentNode.replaceChild(textareaElement, messageElement);
                        textareaElement.focus();

                        textareaElement.addEventListener("blur", function() {
                            var updatedMessage = this.value;
                            var newMessageElement = document.createElement("p");
                            newMessageElement.textContent = updatedMessage;
                            newMessageElement.classList.add("px-5", "mb-5", "text-gray-500", "pb-[3rem]", "lg:pb-0", "lg:ml-[3rem]");
                            newMessageElement.id = "message";

                            this.parentNode.replaceChild(newMessageElement, this);

                            element.classList.remove("hidden");
                            updateData(); // Supongo que esta función actualiza tus datos

                            // Limpia la clase 'hidden' en caso de que ocurra un error antes de llegar aquí
                            element.classList.remove("hidden");
                        });
                    });
                });


                var sendReply = document.querySelectorAll("#replyUserBtn");
                sendReply.forEach(function(element) {
                    element.addEventListener("click", function(event) {
                        event.preventDefault();
                        var replyInput = document.querySelector("#replyUserInput").value;
                        addUserReply(replyInput)
                    });
                });
            }

            updateData()
            

        })
    .catch(error => console.error('Error to read JSON:', error));

    
};