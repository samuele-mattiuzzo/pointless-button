// View functions
function PushViewModel(){
    var self = this;
    
    self.pushes = ko.observableArray([]);
}

function AchievementViewModel(){}

function UserProfileViewModel(){}

// App Views
function MainViewModel() {
    
    // Data
    var self = this;
    
    self.pages = ['Menu', 'Button', 'Profile', 'Achievements'];
    self.chosenPageId = ko.observable();
    self.chosenPageData = ko.observable();

    // Behaviours
    self.goToPage = function(page) {
        self.chosenPageId(page);
        $.get('/', { page: page }, self.chosenPageData);
    };
}

//ko.applyBindings(new MainViewModel());