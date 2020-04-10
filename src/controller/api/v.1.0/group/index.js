const Controller = require('../../../../modules/controller');
const validate = require('../../../../modules/validate');

const GroupModel = require('../../../../models/group');

class GroupController extends Controller{

  constructor(){
    super(GroupModel);
  }

  create = async (req, res) => {
    if (!req.user){
      this.responseJson(res, 403, langs.get('error_access_token_invalid'));
      return ;
    }

    let user = req.user, { name, parentid } = req.body;

    if (!validate.validateMinLength(name, 1)){
      this.responseJson(res, 406, langs.get('error_name_length'));
      return;
    }

    if (parentid){
      let group = this.model.findId(parentid);
      
      if (!group){
        this.responseJson(res, 406, langs.get('error_group_not_found'));
        return;
      }
    }

    let create = { name, createdBy: user._id };
    parentid && (create.parentId = this.model.asObjectId(parentid));

    create = await this.model.create(create);
    this.model.close();

    let data = { group: { ...this.model.asJson(create) } };
    this.responseJson(res, 200, langs.get('success_create_group'), data);
  }

  get = async (req, res) => {
    if (!req.user){
      this.responseJson(res, 403, langs.get('error_access_token_invalid'));
      return ;
    }

    let { start, limit } = req.body;
    
    start = parseInt(start);
    start < 0 && (start = 0);

    limit = parseInt(limit);
    limit < 1 && (limit = config.pagination.limit);
    limit > config.pagination.maxLimit && (limit = config.pagination.maxLimit);

    let options = { skip: start, limit };
    let groups = await this.model.findGroup({ createdBy: req.user._id }, { options });
    this.model.close();

    this.responseJson(res, 200, langs.get('success_get_group'), { groups });
  }

  deleteGroup = async (req, res) => {
    if (!req.user){
      this.responseJson(res, 403, langs.get('error_access_token_invalid'));
      return ;
    }

    let user = req.user, { id } = req.body;

    if (!validate.validateMinLength(id, 24)){
      this.responseJson(res, 406, langs.get('error_group_invalid'));
      return;
    }

    id = this.model.asObjectId(id);
    let group = await this.model.findId(id);

    if (!group || group.createdBy.toString().localeCompare(user._id.toString())){
      this.responseJson(res, 406, langs.get('error_group_not_found'));
      return;
    }

    await group.remove();
    this.model.close();

    this.responseJson(res, 200, langs.get('success_delete_group'));
  }

  update = async (req, res) => {
    if (!req.user){
      this.responseJson(res, 403, langs.get('error_access_token_invalid'));
      return ;
    }

    let user = req.user, { id, name, parentid } = req.body;

    
  }

}

module.exports = new GroupController;