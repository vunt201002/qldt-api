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

export const getAccountConversation = async (req, res) => {
  try {
    const accountId = req.user.id;

    // Fetch all conversations that include the current user as a participant
    const conversations = await ConversationModel.findAll({
      include: [
        {
          model: AccountModel,
          as: 'Accounts', // Ensure this matches the alias used in the association
          where: {id: accountId},
          attributes: [], // We don't need to return any attributes of the participants
          through: {
            attributes: [], // No attributes from the join table either
          },
        },
      ],
    });

    return OkResponse({
      res,
      data: conversations,
    });
  } catch (err) {
    return catchError({
      res,
      err,
      message: 'Error during get account conversation',
    });
  }
};
