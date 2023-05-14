module.exports.recursiveInclude = (include, entityFactory) => {
  return (
    (entityFactory &&
      include?.map((includeParams) => {
        return {
          model:
            includeParams.model ??
            entityFactory.getEntity(includeParams.EntityName),
          as: includeParams.as,
          where: includeParams.where || {},
          required: !!includeParams.required,
          attributes: includeParams.attributes,
          include: this.recursiveInclude(
            includeParams?.include ?? [],
            entityFactory
          ),
          limit: Number(includeParams.limit) || undefined,
          order: includeParams.order || undefined,
          through: includeParams.through || undefined,
          plain: includeParams.plain || false,
        };
      })) ||
    []
  );
};

module.exports.shouldListAll = (params) => {
  const page = Number(params.page?.offset);
  const pageSize = Number(params?.page?.limit);
  const listAll = Boolean(params.listAll);

  const havePage = !isNaN(page) && pageSize >= 0;
  const havePageSize = !isNaN(pageSize) && pageSize >= 0;
  return listAll || !havePage || !havePageSize;
};
