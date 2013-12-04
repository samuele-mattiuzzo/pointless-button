// View functions
function PushViewModel(){
    var self = this;
    self.query = 'SELECT * FROM PUSH';

    self.pushes = ko.observableArray(
        self.getPushes()
    );

    self.getPushes = ko.computed(function() {
        var items = [];
        for(var obj in queryDB(self.query, 'pointless', DB_OBJ)) {
            items.push(new Push(obj.x, obj.y, obj.start,
                obj.location, obj.end, obj.time, obj.duration));
        }
        return items;
    }, self);
}

function AchievementViewModel(){
    var self = this;
    self.query = 'SELECT * FROM ACHIEVEMENT';
    
    self.achievements = ko.observableArray(
        self.getAchievements()
    );

    self.getAchievements = ko.computed(function() {
        var items = [];
        for(var obj in queryDB(self.query, 'pointless', DB_OBJ)) {
            items.push(new Achievement(obj.name, obj.description, obj.completed,
                obj.date_completed, obj.interval, obj.last_checked, obj.query, obj.points));
        }
        return items;
    }, self);
}

function UserProfileViewModel(){}

// App Views
function MainViewModel() {
    
    // Data
    var self = this;
    
    self.pages = ['Button', 'Profile', 'Achievements', 'Menu'];
    self.chosenPageId = ko.observable();
    self.chosenPageData = ko.observable();

    // Behaviours
    self.goToPage = function(page) {
        self.chosenPageId(page);
        $.get('/', { page: page }, self.chosenPageData);
    };

    // Show Button by default
    self.goToPage('Button');
}

//ko.applyBindings(new MainViewModel());