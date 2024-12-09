import catchError from '../reponse/catchError.js';
import {createOrUpdate} from '../helpers/createOrUpdate.js';
import MessageModel from '../model/message.model.js';
import {OkResponse} from '../reponse/Success.js';
import ConversationModel from '../model/conversation.model.js';
import AccountModel from '../model/account.model.js';
import {ForbiddenResponse, NotFoundResponse} from '../reponse/Error.js';

export const createMessage = async (req, res) => {
  try {
    const {conversationId, senderId} = req.body;
    const fileUrl = req?.files?.length ? `/uploads/${req.files[0].filename}` : req.body.fileUrl;

    if (req.user.id !== senderId)
      return ForbiddenResponse({
        res,
        message: 'Unauthorized',
      });

    if (!conversationId || !senderId)
      return NotFoundResponse({
        res,
        message: 'Missing conversation or sender ID.',
      });

    const conversation = await ConversationModel.findOne({
      where: {id: conversationId},
      include: [
        {
          model: AccountModel,
          as: 'Accounts', // Assuming 'Participants' is the alias used in the many-to-many association
          where: {id: senderId},
        },
      ],
    });

    if (!conversation)
      return NotFoundResponse({
        res,
        message: 'Conversation not found or sender is not a participant.',
      });

    const {data} = await createOrUpdate({
      model: MessageModel,
      data: {...req.body, fileUrl},
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

export const deleteMessage = async (req, res) => {
  try {
    const {id} = req.params;
    const accountId = req.user.id;

    const message = await MessageModel.findOne({
      where: {
        id: id,
      },
    });

    if (!message)
      return NotFoundResponse({
        res,
        message: 'Message not found.',
      });

    if (message.senderId !== accountId) {
      return ForbiddenResponse({
        res,
        message: 'You are not the sender of this message',
      });
    }

    await message.destroy();

    return OkResponse({
      res,
      message: 'Delete message successfully',
    });
  } catch (err) {
    return catchError({
      res,
      err,
      message: 'Error during delete message',
    });
  }
};
