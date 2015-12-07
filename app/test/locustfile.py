from locust import HttpLocust, TaskSet

def login(l):
    l.client.post("/login", {"username":"meeko", "password":"meeko"})

def index(l):
    l.client.get("/")

def newPost(l):
    l.client.get("/newPost")

def errPage(l):
	l.client.get('/404')

def getAllPosts(l):
	l.client.get('/api/getAllPosts')

class UserBehavior(TaskSet):
    tasks = {index:2, newPost:1, errPage:1}

    def on_start(self):
        login(self)

class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    min_wait=5000
    max_wait=9000
