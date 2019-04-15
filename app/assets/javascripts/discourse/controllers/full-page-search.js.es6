import { ajax } from "discourse/lib/ajax";
import {
  translateResults,
  searchContextDescription,
  getSearchKey,
  isValidSearchTerm
} from "discourse/lib/search";
import {
  default as computed,
  observes
} from "ember-addons/ember-computed-decorators";
import Category from "discourse/models/category";
import { escapeExpression } from "discourse/lib/utilities";
import { setTransient } from "discourse/lib/page-tracker";
import { iconHTML } from "discourse-common/lib/icon-library";
import Composer from "discourse/models/composer";

const SortOrders = [
  { name: I18n.t("search.relevance"), id: 0 },
  { name: I18n.t("search.latest_post"), id: 1, term: "order:latest" },
  { name: I18n.t("search.most_liked"), id: 2, term: "order:likes" },
  { name: I18n.t("search.most_viewed"), id: 3, term: "order:views" },
  { name: I18n.t("search.latest_topic"), id: 4, term: "order:latest_topic" }
];
const PAGE_LIMIT = 10;

export default Ember.Controller.extend({
  application: Ember.inject.controller(),
  composer: Ember.inject.controller(),
  bulkSelectEnabled: null,

  loading: false,
  queryParams: ["q", "expanded", "context_id", "context", "skip_context"],
  q: null,
  selected: [],
  expanded: false,
  context_id: null,
  context: null,
  searching: false,
  sortOrder: 0,
  sortOrders: SortOrders,
  invalidSearch: false,
  page: 1,
  dev_page_arr: null,
  resultCount: null,
  confluence_list: null,
  confluence_page:1,
  confluence_paginate: ['1'], 
  confluence_msg: '검색중입니다...',

  @computed("resultCount")
  hasResults(resultCount) {
    return (resultCount || 0) > 0;
  },

  @computed("q")
  hasAutofocus(q) {
    return Ember.isEmpty(q);
  },

  @computed("q")
  highlightQuery(q) {
    if (!q) {
      return;
    }
    // remove l which can be used for sorting
    return _.reject(q.split(/\s+/), t => t === "l").join(" ");
  },

  @computed("skip_context", "context")
  searchContextEnabled: {
    get(skip, context) {
      return (!skip && context) || skip === "false";
    },
    set(val) {
      this.set("skip_context", val ? "false" : "true");
    }
  },

  @computed("context", "context_id")
  searchContextDescription(context, id) {
    var name = id;
    if (context === "category") {
      var category = Category.findById(id);
      if (!category) {
        return;
      }

      name = category.get("name");
    }
    return searchContextDescription(context, name);
  },

  @computed("q")
  searchActive(q) {
    return isValidSearchTerm(q);
  },

  @computed("q")
  noSortQ(q) {
    q = this.cleanTerm(q);
    return escapeExpression(q);
  },

  @computed("canCreateTopic", "siteSettings.login_required")
  showSuggestion(canCreateTopic, loginRequired) {
    return canCreateTopic || !loginRequired;
  },

  _searchOnSortChange: true,

  setSearchTerm(term) {
    this._searchOnSortChange = false;
    term = this.cleanTerm(term);
    this._searchOnSortChange = true;
    this.set("searchTerm", term);
  },

  cleanTerm(term) {
    if (term) {
      SortOrders.forEach(order => {
        if (order.term) {
          let matches = term.match(new RegExp(`${order.term}\\b`));
          if (matches) {
            this.set("sortOrder", order.id);
            term = term.replace(new RegExp(`${order.term}\\b`, "g"), "");
            term = term.trim();
          }
        }
      });
    }
    return term;
  },

  @observes("sortOrder")
  triggerSearch() {
    if (this._searchOnSortChange) {
      this.set("page", 1);
      this._search();
    }
  },

  @observes("model")
  modelChanged() {
    if (this.get("searchTerm") !== this.get("q")) {
      this.setSearchTerm(this.get("q"));
    }
  },

  @computed("q")
  showLikeCount(q) {
    return q && q.indexOf("order:likes") > -1;
  },

  @observes("q")
  qChanged() {
    const model = this.get("model");
    if (model && this.get("model.q") !== this.get("q")) {
      this.setSearchTerm(this.get("q"));
      this.send("search");
    }
  },

  @computed("q")
  isPrivateMessage(q) {
    return (
      q &&
      this.currentUser &&
      (q.indexOf("in:private") > -1 ||
        q.indexOf(
          `private_messages:${this.currentUser.get("username_lower")}`
        ) > -1)
    );
  },

  @observes("loading")
  _showFooter() {
    this.set("application.showFooter", !this.get("loading"));
  },

  @computed("resultCount", "noSortQ")
  resultCountLabel(count, term) {
    const plus = count % 50 === 0 ? "+" : "";
    return I18n.t("search.result_count", { count, plus, term });
  },

  @observes("model.posts.length")
  resultCountChanged() {
    this.set("resultCount", this.get("model.posts.length"));
  },

  @computed("hasResults")
  canBulkSelect(hasResults) {
    return this.currentUser && this.currentUser.staff && hasResults;
  },

  @computed("model.grouped_search_result.can_create_topic")
  canCreateTopic(userCanCreateTopic) {
    return this.currentUser && userCanCreateTopic;
  },

  @computed("expanded")
  searchAdvancedIcon(expanded) {
    return iconHTML(expanded ? "caret-down" : "caret-right");
  },

  @computed("page")
  isLastPage(page) {
    return page === PAGE_LIMIT;
  },
  
  @computed("page")
  pageNumArray(page) {
    return this._pageNumArray(page);
  },

  _pageNumArray(page) {
    // 마지막 번호까지 최대 5개의 페이지 번호를 표시함
    // 총페이지 수보다 클경우 마지막 페이지 까지만 표시
    // 5 배수 단위로 페이지가 표시되야함
    // page는 1보다 작을 수 없다.
    if(page < 1) page = 1;

    var page_arr = [];
    var startNum = Math.floor((page-1)/5)*5 + 1;
    var lastNum = Math.floor((page-1)/5)*5 + 5;
    var max = this.get('model.grouped_search_result.total_page');          
    
    //lastNum은 max를 초과할 수 없다
    // 초과하는 요청의 경우 page=lastNum 대입
    if(lastNum > max) lastNum = max;
    if(page > max) page = lastNum;

    //이전(pre), 페이지 번호가 6 이상인경우에 추가
    if (page >= 6) {    
      page_arr.push({num: 'pre'});
    }      

    for(var i=startNum; i<=lastNum; i++){
      if(i<1){continue;}
      //현재 페이지번호 span에 bold 처리      
      var class_name = (i==page) ? "bold selected" : "";      
      page_arr.push({num: i, class_name: class_name});
    }

    //lastNum 이 max 보다 작을 경우 next 추가
    if (lastNum < max) {            
      page_arr.push({num: 'next'});
    }

    return page_arr;
  },

  searchButtonDisabled: Ember.computed.or("searching", "loading"),

  _search() {
    if (this.get("searching")) {
      return;
    }

    this.set("invalidSearch", false);
    const searchTerm = this.get("searchTerm");
    if (!isValidSearchTerm(searchTerm)) {
      this.set("invalidSearch", true);
      return;
    }

    let args = { q: searchTerm, page: this.get("page") };

    if (args.page === 1) {
      this.set("bulkSelectEnabled", false);
      this.get("selected").clear();
      this.set("searching", true);
    } else {
      this.set("loading", true);
    }

    const sortOrder = this.get("sortOrder");
    if (sortOrder && SortOrders[sortOrder].term) {
      args.q += " " + SortOrders[sortOrder].term;
    }

    this.set("q", args.q);

    const skip = this.get("skip_context");
    if ((!skip && this.get("context")) || skip === "false") {
      args.search_context = {
        type: this.get("context"),
        id: this.get("context_id")
      };
    }

    const searchKey = getSearchKey(args);

    ajax("/search", { data: args })
      .then(results => {
        const model = translateResults(results) || {};

        if (results.grouped_search_result) {
          this.set("q", results.grouped_search_result.term);
        }
        /*
        // 기존에는 아래로 스크롤 하면 추가로 게시물들이 리스트에 추가되든 형태였음
        // 페이징을 하는 방식으로 변경을 하기위해 주석처리한다.
        if (args.page > 1) {
          if (model) {
            this.get("model").posts.pushObjects(model.posts);
            this.get("model").topics.pushObjects(model.topics);
            this.get("model").set(
              "grouped_search_result",
              results.grouped_search_result
            );
          }
        } else {
          setTransient("lastSearch", { searchKey, model }, 5);
          model.grouped_search_result = results.grouped_search_result;
          this.set("model", model);
        }
        */
        // 위 코드에서 else 부분만 가져와서 사용함
        setTransient("lastSearch", { searchKey, model }, 5);
        model.grouped_search_result = results.grouped_search_result;
        this.set("model", model);
        //페이징 배열 생성
        this.set('pageNumArray', this._pageNumArray(this.get('page')));
      })
      .finally(() => {
        this.set("searching", false);
        this.set("loading", false);
      });
  },
  _searchConfluence(page) {
    // 컨플루언스 검색결과를 페이지 로딩 후에 가져온다
    // 1. 컨플루언스 사이트에 대한 응답이 늦거나 
    // 2. 장애가 있을 경우 본 사이트 검색결과 출력이 늦어지는걸 방지하기 위함
    // 때문에 기존 검색결과 model 생성과 페이지 출력과는 별개로
    // 페이지가 출력된 후에 컨플루언스 api를 요청한다
    // model에 이미 검색 결과가 있을경우 추가하지 않음    
    
    // 유효성 체크
    if(page == null) page = 1;        
    if(typeof page != typeof 1) page = 1; //숫자 타입인지 체크    
    if(page < 1) page = 1;

    //var start = page%5==0 ? (page/5) : (page/5)+1;
    var start = Math.floor((page-1) / 5) * 15;
    if(start < 0) start = 0;
    
    this.set('confluence_page', page);  //현재 페이지 set
    
    // 리스트 초기화
    // this.set('confluence', '검색중...');    
    ajax('/search-confluence?keyword='+this.q+'&start='+start).then(res => {
      var re = /<.{1,20}>(.{0,50})<\/.{1,20}>/g;      
      Object.keys(res.results).forEach(function(i){
        // html 태그 제거, 순수 string만 jquery 를 이용해 뽑는다.
        res.results[i].body.storage.value = $(res.results[i].body.storage.value).text();
      })
      // 페이징 배열 만들기
      // 컨플루언스에서 검색 키워드에 대해서 총 카운트를 제공해주지 않는다
      // limit 25제한 되있음
      // (버전 차이인듯, 다른 버전에서는 response에 total_count가 있음)
      // 총 카운트를 모르기 때문에 limit 15으로 response를 받고 15 이상인 경우 다음, 이전 (5페이지씩 이동) 처리와            
      // 15 이하인경우 해당 페이지 까지만 표시한다(최대 5개까지 페이지 번호를 표시할예정임, 페이지당 5개의 게시물)
      // res._links.next가 있으면 이후 페이지가 있는것임. 다음(next) 버튼 표시하면 됨
      // res.size 가 리턴받은 게시물의 숫자임
      // 3로 나눠서 페이지 갯수를 구함(ex: 게시물이 4개이면 (4/3)+1=2 해서 2개의 페이지 번호 표시)
      // 3로 나눠 떨어지면 +1 하지않음
      var page_arr = [];
      var page_count = res.size%3==0 ? (res.size/3) : (res.size/3)+1;
      page_count = Math.floor(page_count);      
      //var start_num = res.start%25==0 ? (res.start/25) : (res.start/25)+1;
      var start_num = Math.floor(start/3) + 1
      //start_num = Math.floor(start_num);

      //이전(pre), 페이지 번호가 6 이상인경우에 추가
      if (page >= 6) {        
        page_arr.push({num: 'pre'});
      }
      
      //페이지 번호
      for (var i = start_num; i < (start_num+page_count); i++){        
        //현재 페이지번호 span에 bold 처리      
        var class_name = (i==page) ? "bold selected" : "";      
        page_arr.push({num: i, class_name: class_name});
      }
      
      //다음(next) size 가 15이상인 경우
      if (res._links.next != null) {        
        page_arr.push({num: 'next'});
      }
          
      this.set('confluence_list', res.results.slice(((page-1)%5)*3, ((page-1)%5)*3+3));      
      this.set('confluence_paginate', page_arr);
    }).finally(() => {
      console.log(this.get('confluence_list'));
      if(this.get('confluence_list').length<1){
        this.set('confluence_msg', '검색 결과가 없습니다.');
      }      
      this.set("loading", false);
    });
  },

  actions: {
    createTopic(searchTerm) {
      let topicCategory;
      if (searchTerm.indexOf("category:") !== -1) {
        const match = searchTerm.match(/category:(\S*)/);
        if (match && match[1]) {
          topicCategory = match[1];
        }
      }
      this.get("composer").open({
        action: Composer.CREATE_TOPIC,
        draftKey: Composer.CREATE_TOPIC,
        topicCategory
      });
    },

    selectAll() {
      this.get("selected").addObjects(
        this.get("model.posts").map(r => r.topic)
      );
      // Doing this the proper way is a HUGE pain,
      // we can hack this to work by observing each on the array
      // in the component, however, when we select ANYTHING, we would force
      // 50 traversals of the list
      // This hack is cheap and easy
      $(".fps-result input[type=checkbox]").prop("checked", true);
    },

    clearAll() {
      this.get("selected").clear();
      $(".fps-result input[type=checkbox]").prop("checked", false);
    },

    toggleBulkSelect() {
      this.toggleProperty("bulkSelectEnabled");
      this.get("selected").clear();
    },

    search() {      
      // 탭전환
      // this.actions.searchTab(0);      
      this.set("page", 1);
      this._search();
      //컨플루언스 검색
      this._searchConfluence();
      
      if (this.site.mobileView) this.set("expanded", false);
    },

    toggleAdvancedSearch() {
      this.toggleProperty("expanded");
    },

    loadMore() {
      var page = this.get("page");
      if (
        this.get("model.grouped_search_result.more_full_page_results") &&
        !this.get("loading") &&
        page < PAGE_LIMIT
      ) {
        this.incrementProperty("page");
        this._search();
      }
    },

    logClick(topicId) {
      if (this.get("model.grouped_search_result.search_log_id") && topicId) {
        ajax("/search/click", {
          type: "POST",
          data: {
            search_log_id: this.get(
              "model.grouped_search_result.search_log_id"
            ),
            search_result_id: topicId,
            search_result_type: "topic"
          }
        });
      }
    },
    searchTab(tab_num) {
      // 선택하지 않은 탭 비활성화, 선택한 탭 활성화      
      $('.search-tab ul li').removeClass('active');
      $('.search-tab ul li:eq('+tab_num+')').addClass('active');
      $('.tab_item').addClass('display-none');
      $('.tab_item:eq('+tab_num+')').removeClass('display-none');

      // 컨플루언스 검색결과를 탭 선택 후에 가져온다
      // 1. 컨플루언스 사이트에 대한 응답이 늦거나 
      // 2. 장애가 있을 경우 본 사이트 검색결과 출력이 늦어지는걸 방지하기 위함
      // 때문에 기존 검색결과 model 생성과 페이지 출력과는 별개로
      // 페이지가 출력되고 컨플루언스 탭을 눌렀을때 api 호출 하여 model에 그 결과를 더한다
      // model에 이미 검색 결과가 있을경우 추가하지 않음      
      if(tab_num) {
        // 리스트 초기화
        this.set('confluence', '검색중...');
        ajax('/search-confluence?keyword='+this.q).then(res => {            
          this.set('confluence', res);
        });
      }
    },
    searchConfluence() {      
      this._searchConfluence();
    },
    goPage(page) {
      var current = this.get('page');

      if(page=='pre'){
        page = (current - 5) < 0 ? 1 : (current - 5)
      }else if(page=='next'){
        var max = this.get('model.grouped_search_result.total_page');        
        //page = (current + 5) > max ? max : (current + 5);
        page = Math.floor((current+4)/5)*5 + 1;        
        if(page > max) page = max;
      }            
      
      this.set('page', page);
      this._search();
    },
    confluence_goPage(page){
      this.set('loading', true); //로딩 아이콘표시
      var current = this.get('confluence_page');

      if(page=='pre'){
        page = current - 5;
      }else if(page=='next'){
        // 5페이지에서 다음 누를경우 6페이지로 감
        // 1페이지에서 다음 누를 경우 6페이지로 감
        // 다음 다섯페이지에서 제일 앞에 페이지가 나오도록 한다
        page = Math.floor((current+4)/5)*5 + 1;
      }      
      this._searchConfluence(page);
    }
  }
});
