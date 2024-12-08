import catchError from '../reponse/catchError.js';
import AccountModel from '../model/account.model.js';
import ConversationModel from '../model/conversation.model.js';
import {OkResponse} from '../reponse/Success.js';

export const createConversation = async (req, res) => {
  try {
    const {type, title, participants} = req.body;

    const conversation = await ConversationModel.create({
      type: type,
      title: title,
    });

    const accounts = await AccountModel.findAll({
      where: {id: participants},
    });

    if (accounts && accounts.length > 0) await conversation.addAccounts(accounts); // Ensuring the method name matches the association

    return OkResponse({
      res,
      data: conversation,
    });
  } catch (err) {
    return catchError({
      res,
      err,
      message: 'Error during create conversation',
    });
  }
};
