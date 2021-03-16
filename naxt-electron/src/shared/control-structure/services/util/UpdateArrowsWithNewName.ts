import { Arrowed, Boxed, Id, Named, ProjectId } from '../../../Interfaces';
import { Repository } from '../../../rxdb-repository/Repository';
import { Arrow, Box } from '../../models';

export async function updateBoxesWithNewName<T extends ProjectId & Id & Named & Boxed>(
  obj: T,
  repo: Repository<Box>
): Promise<T[]> {
  const promises = [];
  const boxes = await repo.findAll(obj.projectId);
  boxes.filter(box => box.id === obj.boxId).forEach(box => promises.push(repo.update({ ...box, name: obj.name })));
  return Promise.all(promises);
}

export async function updateArrowsWithNewName<T extends ProjectId & Id & Named & Arrowed>(
  oldObj: T,
  newObj: T,
  repo: Repository<Arrow>
): Promise<T[]> {
  const promises = [];
  const arrows = await repo.findAll(oldObj.projectId);
  arrows
    .filter(arrow => arrow.id === oldObj.arrowId)
    .forEach(arrow => promises.push(repo.update(changeLabelName(arrow, oldObj.name, newObj.name))));
  return Promise.all(promises);
}

// const regex = /^(.*)(@\?!@.*)/m;
const prefix = '@?!@';
function changeLabelName(arrow: Arrow, oldName: string, newName: string): Arrow {
  // if (!regex.test(arrow.label)) throw new NAXTError('Arrow label does not match regex:', arrow);
  // const match = arrow.label.match(regex);
  // return { ...arrow, label: `${newName}${match[2]}` };
  return { ...arrow, label: arrow.label.replace(oldName + prefix, newName + prefix) };
}
