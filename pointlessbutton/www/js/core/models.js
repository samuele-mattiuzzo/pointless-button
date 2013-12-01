// Models
function Push(x, y, s, l, e, t, d){

    /*
    * Model for PUSH object
    */
    var self = this;
    self.x = x;
    self.y = y;
    self.start = s;
    self.location = l;
    self.end = e;
    self.time = t;
    self.duration = d;
}

function Achievement(n, d, c, dc, i, lc, q, p){
    
    /*
    * Model for ACHIEVEMENT object
    */
    var self = this;
    self.name = n;
    self.description = d;
    self.completed = c;
    self.date_completed = dc;
    self.interval = i;
    self.last_checked = lc;
    self.query = q;
    self.points = p;
}

function UserProfile(n, e, dj){

    /*
    * Model for USERPROFILE object.
    * will rule the main view with push_list and achievement_list
    */
    var self = this;
    self.name = n;
    self.email = e;
    self.date_joined = dj;

    self.push_list = ko.computed(function(){
        return [];
    });

    self.achievement_list = ko.computed(function(){
        return [];
    });

    self.points = ko.computed(function(){
        return 0;
    });
}