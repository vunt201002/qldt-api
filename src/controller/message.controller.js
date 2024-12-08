import catchError from '../reponse/catchError.js';
import {createOrUpdate} from '../helpers/createOrUpdate.js';
import MessageModel from '../model/message.model.js';
import {OkResponse} from '../reponse/Success.js';
import {getElementByField} from '../helpers/getElementByField.js';
import ConversationModel from '../model/conversation.model.js';
import AccountModel from '../model/account.model.js';
import {NotFoundResponse} from '../reponse/Error.js';

export const createMessage = async (req, res) => {
  try {
    const {conversationId, senderId} = req.body;

    const [conversation, sender] = await Promise.all([
      getElementByField({
        model: ConversationModel,
        field: 'id',
        value: conversationId,
      }),
      getElementByField({
        model: AccountModel,
        field: 'id',
        value: senderId,
      }),
    ]);

    if (!conversationId || !senderId || !conversation || !sender) {
      return NotFoundResponse({
        res,
        message: 'Conversation or sender not found.',
      });
    }

    const {data} = await createOrUpdate({
      model: MessageModel,
      data: req.body,
      value: '',
    });

    return OkResponse({
      res,
      data,
    });
  } catch (err) {
    return catchError({
      res,
      err,
      message: 'Error during create message',
    });
  }
};
