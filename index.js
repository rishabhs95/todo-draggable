var todo = todo || {},
    data = JSON.parse(localStorage.getItem("todoData"));

data = data || {};

var safeColors = ['00', '11', '22', '33', '44', '55', '66', '77', '88', '99', 'aa', 'bb', 'cc', 'dd', 'ee', 'ff'];
var rand = function() {
    return Math.floor(Math.random() * 16);
};
var randomColor = function() {
    var r = safeColors[rand()];
    var g = safeColors[rand()];
    var b = safeColors[rand()];
    return "#" + r + g + b;
};

var defaults = {
        todoTask: "todo-task",
        todoHeader: "task-header",
        taskId: "task-",
        formId: "todo-form",
        dataAttribute: "data",
    },
    codes = {
        "1": "#pending",
        "2": "#completed"
    };

// Remove task
var removeElement = function(id) {
    delete data[id];
    localStorage.setItem("todoData", JSON.stringify(data));
    // Hiding Delete Area
    $("#" + defaults.deleteDiv).hide();
    $("#" + defaults.taskId + id).remove();
};

(function(todo, data, $) {

    todo.init = function(options) {

        options = options || {};
        options = $.extend({}, defaults, options);

        $.each(data, function(index, params) {
            generateElement(params);
        });

        // Adding drop function to each category of task
        $.each(codes, function(index, value) {
            $(value).droppable({
                drop: function(event, ui) {
                    var element = ui.helper,
                        css_id = element.attr("id"),
                        id = css_id.replace(options.taskId, ""),
                        object = data[id];

                    // Removing old element
                    removeObject(object);
                    // Changing object code
                    object.code = index;
                    // Generating new element
                    generateElement(object);
                    // Updating Local Storage
                    data[id] = object;
                    localStorage.setItem("todoData", JSON.stringify(data));
                    // Hiding Delete Area
                    $("#" + defaults.deleteDiv).hide();
                }
            });
        });
    };

    var removeObject = function (params) {
        $("#" + defaults.taskId + params.id).remove();
    };

    // Add Task
    var generateElement = function(params) {
        var parent = $(codes[params.code]),
            wrapper;
        if (!parent) {
            return;
        }
        if (params.code == 1) {
            wrapper = $("<div />", {
                "class": defaults.todoTask + "col-md-5 col-sm-5 col-xs-5",
                "id": defaults.taskId + params.id,
                "data": params.id,
                "style": "margin: 10px 25px 10px 25px;text-align: center;height: 100px;font-size: 50px; overflow: auto;"
            }).appendTo(parent);
        }
        else {
            wrapper = $("<div />", {
                "class": defaults.todoTask + "col-md-12 col-sm-12 col-xs-12",
                "id": defaults.taskId + params.id,
                "data": params.id,
                "style": "margin: 10px 5px 10px 5px; text-align: center;height: 100px;font-size: 40px; overflow: auto;"
            }).appendTo(parent);
        }
        $('<a class="delete" onclick="removeElement(' + params.id + ')">X</a>').appendTo(wrapper);
        $("<div />", {
            "class": defaults.todoHeader,
            "text": params.title
        }).appendTo(wrapper);

        if (params.code == 1) {
            $(wrapper).css('background', randomColor());
        }

        else {
            $(wrapper).css('background', "white");
        }

        wrapper.draggable({
            start: function() {
                $("#" + defaults.deleteDiv).show();
            },
            stop: function() {
                $("#" + defaults.deleteDiv).hide();
            },
            revert: "invalid",
            revertDuration: 200,
            opacity: true
        });

    };

    todo.add = function() {
        var inputs = $("#" + defaults.formId + " :input"),
            errorMessage = "Title can not be empty",
            id, title, tempData;

        if (inputs.length !== 2) {
            return;
        }

        title = inputs[0].value;

        id = new Date().getTime();

        tempData = {
            id: id,
            code: "1",
            title: title,
        };

        // Saving element in local storage
        data[id] = tempData;
        localStorage.setItem("todoData", JSON.stringify(data));

        // Generate Todo Element
        generateElement(tempData);

        // Reset Form
        inputs[0].value = "";
    };

})(todo, data, jQuery);

todo.init();
